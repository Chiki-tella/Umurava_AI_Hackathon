import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Application } from "../models/application.model";
import { Job } from "../models/job.model";
import { User, JobSeeker } from "../models/user.model";
import { Notification } from "../models/notification.model";
import { applySchema, selectCandidateSchema } from "../validation/application.schema";
import { AuthRequest } from "../middleware/auth.middleware";
import { parseComprehensiveCV, extractSkillsFromText, CVData } from "../utils/cvParser";
import fs from "fs";
import path from "path";

// JobSeeker: Apply to Job
export const applyToJob = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = applySchema.parse(req.body);
        console.log('🚀 Application submission request:', { jobId: data.jobId, applicantId: req.user!.id, email: req.user!.email });

        const job = await Job.findById(data.jobId);
        if (!job) {
            console.log('❌ Job not found:', data.jobId);
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }
        console.log('✅ Job found:', job.title);

        const existingApplication = await Application.findOne({ jobId: data.jobId, applicantId: req.user!.id });
        if (existingApplication) {
            console.log('❌ Already applied for this job');
            res.status(400).json({ success: false, message: "You have already applied for this job" });
            return;
        }

        const application = await Application.create({
            jobId: data.jobId,
            applicantId: req.user!.id,
            cvUrl: data.cvUrl || "mock_cv_url.pdf",
        });
        console.log('✅ Application created successfully:', application._id);

        res.status(201).json({ success: true, application });
    } catch (error: any) {
        console.error('❌ Application submission error:', {
            message: error.message,
            stack: error.stack,
            errors: error.errors,
            name: error.name
        });
        res.status(400).json({ 
            success: false, 
            message: error.message || "Failed to apply to job",
            details: error.errors || null
        });
    }
};

// JobSeeker: View Own Applications
export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('🔍 Fetching applications for user:', { id: req.user!.id, email: req.user!.email });
        const applications = await Application.find({ applicantId: req.user!.id })
            .populate("jobId", "title location status")
            .sort({ createdAt: -1 });
        
        console.log('📊 Found applications:', applications.length);
        applications.forEach((app, index) => {
            const jobTitle = (app.jobId as any)?.title || 'Unknown';
            console.log(`  ${index + 1}. Job: ${jobTitle}, Status: ${app.status}, Created: ${app.createdAt}`);
        });

        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error: any) {
        console.error('❌ Error fetching applications:', error);
        res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
};

// Recruiter: View Applicants for a Job
export const getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.jobId;
        console.log('🔍 Recruiter fetching applications for job:', { jobId, recruiterId: req.user!.id, recruiterEmail: req.user!.email });
        
        const job = await Job.findById(jobId);

        if (!job) {
            console.log('❌ Job not found:', jobId);
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }

        console.log('✅ Job found:', job.title, 'Owner:', job.createdBy);
        
        if (job.createdBy.toString() !== req.user!.id) {
            console.log('❌ Forbidden: Job owner mismatch', { jobOwner: job.createdBy, recruiterId: req.user!.id });
            res.status(403).json({ success: false, message: "Forbidden. You do not own this job." });
            return;
        }

        const applications = await Application.find({ jobId })
            .populate("applicantId", "fullName email skills")
            .sort({ createdAt: -1 });
        
        console.log('📊 Found applications for job:', applications.length);
        applications.forEach((app, index) => {
            const applicant = app.applicantId as any;
            console.log(`  ${index + 1}. Applicant: ${applicant?.fullName || 'Unknown'}, Email: ${applicant?.email || 'Unknown'}, Status: ${app.status}`);
        });

        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error: any) {
        console.error('❌ Error fetching job applications:', error);
        res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
};

// Recruiter: AI Screening (Mock)
export const screenApplicants = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.jobId;
        console.log('🤖 Starting AI screening for job:', { jobId, recruiterId: req.user!.id });
        
        const job = await Job.findById(jobId);

        if (!job) {
            console.log('❌ Job not found for screening:', jobId);
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }

        if (job.createdBy.toString() !== req.user!.id) {
            console.log('❌ Unauthorized screening attempt');
            res.status(403).json({ success: false, message: "Forbidden. You do not own this job." });
            return;
        }

        console.log('✅ Job found for screening:', job.title);
        const applications = await Application.find({ jobId }).populate("applicantId");
        console.log(`📊 Found ${applications.length} applications to screen`);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        // Use gemini-flash-latest since older models dropped mapping support for this specific credential
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: { responseMimeType: "application/json" }
        });

        for (let app of applications) {
            const applicant = await JobSeeker.findOne({ _id: app.applicantId });
            console.log(`🔍 Screening application for applicant: ${applicant?.fullName}`);
            console.log(`📋 Applicant data:`, applicant ? {
                id: applicant._id,
                fullName: applicant.fullName,
                role: applicant.role,
                skills: applicant.skills,
                skillsLength: applicant.skills?.length || 0
            } : 'NOT FOUND');

            if (applicant) {
                let cvData: CVData | null = null;
                let cvSkills: string[] = [];
                
                // Parse CV if available
                if (app.cvUrl && app.cvUrl !== "mock_cv_url.pdf") {
                    try {
                        console.log('📄 Reading CV file:', app.cvUrl);
                        
                        // Try to read the actual CV file
                        let cvBuffer: Buffer | undefined;
                        try {
                            // Construct full file path
                            const fullPath = path.join(process.cwd(), app.cvUrl);
                            console.log('🔍 Looking for CV at:', fullPath);
                            
                            if (fs.existsSync(fullPath)) {
                                cvBuffer = fs.readFileSync(fullPath);
                                console.log('✅ CV file read successfully from:', fullPath);
                            } else {
                                console.log('⚠️ CV file not found at:', fullPath);
                                cvData = null;
                                cvSkills = [];
                            }
                        } catch (fileError) {
                            console.log('⚠️ Could not read CV file:', fileError);
                            cvData = null;
                            cvSkills = [];
                        }
                        
                        if (cvBuffer) {
                            // Parse the actual CV
                            cvData = await parseComprehensiveCV(cvBuffer);
                            cvSkills = cvData.skills;
                            
                            console.log(`📄 Real CV parsed successfully:`, {
                                name: cvData.fullName,
                                github: cvData.github,
                                skillsCount: cvSkills.length,
                                educationCount: cvData.education?.length || 0,
                                experienceCount: cvData.experience?.length || 0
                            });
                        }
                    } catch (error) {
                        console.log('⚠️ Could not parse CV:', error);
                        cvData = null;
                        cvSkills = [];
                    }
                } else {
                    console.log('ℹ️ No CV URL provided or using mock CV');
                    cvData = null;
                    cvSkills = [];
                }
                
                // Combine profile skills with CV skills
                let allSkills: string[] = [];
                if (applicant.skills && applicant.skills.length > 0) {
                    allSkills = [...applicant.skills];
                    console.log(`� Profile skills: ${applicant.skills.join(", ")}`);
                }
                if (cvSkills.length > 0) {
                    allSkills = [...allSkills, ...cvSkills];
                    console.log(`📄 CV extracted skills: ${cvSkills.join(", ")}`);
                }
                
                // Remove duplicates
                const uniqueSkills = [...new Set(allSkills)];
                
                if (uniqueSkills.length === 0 && !cvData) {
                    console.log('⚠️ No skills found for applicant:', applicant.fullName);
                    app.score = 0;
                    app.aiSummary = "The candidate profile does not list any skills, making it impossible to determine if they meet the requirements.";
                } else {
                    // Build comprehensive analysis prompt
                    const educationText = cvData?.education?.map(edu => 
                        `${edu.degree} from ${edu.institution} (${edu.year})${edu.gpa ? ` - GPA: ${edu.gpa}` : ''}`
                    ).join('\n') || 'No education details found';
                    
                    const experienceText = cvData?.experience?.map(exp => 
                        `${exp.title} at ${exp.company}${exp.duration ? ` (${exp.duration})` : ''}${exp.description ? `\nDescription: ${exp.description}` : ''}`
                    ).join('\n\n') || 'No experience details found';
                    
                    const languagesText = cvData?.languages?.join(', ') || 'No languages specified';
                    
                    const prompt = `
                    You are an expert AI technical recruiter conducting a comprehensive candidate evaluation. 
                    Analyze BOTH the candidate's profile information AND their detailed CV content.
                    
                    === JOB REQUIREMENTS ===
                    Position: ${job.title}
                    Description: ${job.description}
                    Required Skills: ${job.requiredSkills.join(", ")}
                    
                    === CANDIDATE PROFILE ===
                    Name: ${applicant.fullName}
                    Profile Skills: ${applicant.skills?.join(", ") || "None listed"}
                    Preferred Roles: ${(applicant as any).interestedRoles?.join(", ") || "Not specified"}
                    Preferred Locations: ${(applicant as any).preferredLocations?.join(", ") || "Not specified"}
                    
                    === CV ANALYSIS ===
                    ${cvData ? `
                    CV Name: ${cvData.fullName || 'Not found'}
                    Email: ${cvData.email || 'Not found'}
                    GitHub: ${cvData.github || 'Not found'}
                    LinkedIn: ${cvData.linkedin || 'Not found'}
                    Portfolio: ${cvData.portfolio || 'Not found'}
                    
                    CV Skills: ${cvSkills.join(", ") || "None found"}
                    Languages: ${languagesText}
                    
                    EDUCATION:
                    ${educationText}
                    
                    EXPERIENCE:
                    ${experienceText}
                    ` : 'No CV available for analysis'}
                    
                    === EVALUATION TASK ===
                    1. Compare required skills with both profile and CV skills
                    2. Identify missing skills - what required skills the applicant lacks
                    3. Assess education relevance and level
                    4. Evaluate experience alignment with job requirements
                    5. Check for contradictions between profile and CV
                    6. Consider language requirements if applicable
                    7. Evaluate overall fit based on comprehensive data
                    8. Provide specific gap analysis - what they need to learn/improve
                    
                    Return a JSON object EXACTLY in this format with no markdown wrappers:
                    {
                      "score": <number 0-100 representing match strength>,
                      "summary": "<2-3 sentences explaining why they are or aren't a good fit, including key strengths and any concerns>",
                      "strengths": ["<list of key strengths>"],
                      "concerns": ["<list of any concerns or gaps>"],
                      "missingSkills": ["<specific required skills the applicant is missing>"],
                      "gaps": ["<detailed description of what the applicant is lacking and what they need to improve>"],
                      "github": "${cvData?.github || 'Not provided'}",
                      "contradictions": ["<any contradictions between profile and CV>"]
                    }
                    `;

                try {
                    console.log('🤖 Calling Gemini AI for:', (applicant as any)?.fullName);
                    console.log('📝 Prompt length:', prompt.length, 'characters');
                    
                    const result = await model.generateContent(prompt);
                    let responseText = result.response.text().trim();
                    responseText = responseText.replace(/```json/i, "").replace(/```/g, "").trim();

                    console.log('🤖 Raw AI response:', responseText);
                    const aiData = JSON.parse(responseText);
                    console.log('✅ AI comprehensive analysis for', (applicant as any)?.fullName, ':', aiData);

                    // Apply deterministic scoring to reduce variability
                    let finalScore = aiData.score || 0;
                    
                    // Calculate skill match percentage for consistency
                    const requiredSkills = job.requiredSkills || [];
                    const candidateSkills = uniqueSkills || [];
                    const matchingSkills = requiredSkills.filter(skill => 
                        candidateSkills.some(candidateSkill => 
                            candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(candidateSkill.toLowerCase())
                        )
                    );
                    
                    const skillMatchPercentage = requiredSkills.length > 0 
                        ? (matchingSkills.length / requiredSkills.length) * 100 
                        : 0;
                    
                    console.log('📊 Skill analysis:', {
                        required: requiredSkills.length,
                        candidate: candidateSkills.length,
                        matching: matchingSkills.length,
                        matchPercentage: skillMatchPercentage.toFixed(1),
                        aiScore: finalScore
                    });
                    
                    // Blend AI score with deterministic skill matching for consistency
                    finalScore = Math.round((finalScore * 0.7) + (skillMatchPercentage * 0.3));
                    finalScore = Math.min(100, Math.max(0, finalScore)); // Ensure 0-100 range
                    
                    console.log('🎯 Final blended score:', finalScore);
                    app.score = finalScore;
                    
                    // Store comprehensive analysis with organized formatting
                    const summary = aiData.summary || "No summary provided.";
                    const strengths = aiData.strengths && aiData.strengths.length > 0 
                        ? aiData.strengths.map((s: string) => `• ${s}`).join('\n') 
                        : null;
                    const concerns = aiData.concerns && aiData.concerns.length > 0 
                        ? aiData.concerns.map((c: string) => `• ${c}`).join('\n') 
                        : null;
                    const missingSkills = aiData.missingSkills && aiData.missingSkills.length > 0 
                        ? aiData.missingSkills.join(', ') 
                        : null;
                    const gaps = aiData.gaps && aiData.gaps.length > 0 
                        ? aiData.gaps.map((g: string) => `• ${g}`).join('\n') 
                        : null;
                    const contradictions = aiData.contradictions && aiData.contradictions.length > 0 
                        ? aiData.contradictions.map((c: string) => `• ${c}`).join('\n') 
                        : null;
                    const github = aiData.github || cvData?.github || 'Not provided';
                    
                    // Build organized summary with clean formatting
                    let organizedSummary = `ASSESSMENT\n${summary}`;
                    
                    if (strengths) {
                        organizedSummary += `\n\n\nSTRENGTHS\n${strengths}`;
                    }
                    
                    if (concerns) {
                        organizedSummary += `\n\n\nCONCERNS\n${concerns}`;
                    }
                    
                    if (missingSkills) {
                        organizedSummary += `\n\n\nMISSING SKILLS\n${missingSkills}`;
                    }
                    
                    if (gaps) {
                        organizedSummary += `\n\n\nDEVELOPMENT AREAS\n${gaps}`;
                    }
                    
                    if (contradictions) {
                        organizedSummary += `\n\n\nNOTES\n${contradictions}`;
                    }
                    
                    organizedSummary += `\n\n\nGITHUB\n${github}`;
                    
                    console.log('📝 Final formatted summary preview:');
                    console.log(organizedSummary.substring(0, 200) + '...');
                    
                    app.aiSummary = organizedSummary;
                    
                    // Store GitHub in application for frontend display
                    if (github !== 'Not provided') {
                        (app as any).github = github;
                    }
                } catch (err: any) {
                    console.error("❌ Gemini AI error for", (applicant as any)?.fullName, ":", err.message);
                    app.score = 0;
                    app.aiSummary = "Error computing summary.";
                }
                }
            } else {
                console.log('⚠️ No applicant found for application ID:', app._id);
                app.score = 0;
                app.aiSummary = "Applicant profile not found.";
            }

            await app.save();
        }

        const rankedApplications = await Application.find({ jobId })
            .populate("applicantId", "fullName email skills")
            .sort({ score: -1 });

        console.log('🎉 AI screening completed! Ranked applications:', rankedApplications.map(app => ({
            applicant: (app.applicantId as any)?.fullName,
            score: app.score,
            summary: app.aiSummary
        })));

        res.status(200).json({ success: true, applications: rankedApplications });
    } catch (error: any) {
        console.error('❌ AI screening failed:', error);
        res.status(500).json({ success: false, message: "Failed to screen applicants" });
    }
};

// Recruiter: Select Candidate
export const selectCandidate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const data = selectCandidateSchema.parse(req.body);
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId).populate("jobId");

        if (!application) {
            res.status(404).json({ success: false, message: "Application not found" });
            return;
        }

        const job = application.jobId as any;

        if (job.createdBy.toString() !== req.user!.id) {
            res.status(403).json({ success: false, message: "Forbidden. You do not own this job." });
            return;
        }

        application.status = data.status;
        await application.save();

        await Notification.create({
            userId: application.applicantId,
            message: `Your application status for job "${job.title}" has been updated to ${data.status}.`,
        });

        res.status(200).json({ success: true, application });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to select candidate" });
    }
};
