import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Application } from "../models/application.model";
import { Job } from "../models/job.model";
import { JobSeeker } from "../models/user.model";
import { Notification } from "../models/notification.model";
import { applySchema, selectCandidateSchema } from "../validation/application.schema";
import { AuthRequest } from "../middleware/auth.middleware";

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
        console.error('❌ Application submission error:', error);
        res.status(400).json({ success: false, message: error.message || "Failed to apply to job" });
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
            const applicant = await User.findById(app.applicantId);
            console.log(`🔍 Screening application for applicant: ${(applicant as any)?.fullName}`);

            if (applicant && applicant.skills) {
                const prompt = `
                You are an expert AI technical recruiter. Evaluate the candidate's skills against the job requirements.
                
                Job Title: ${job.title}
                Job Description: ${job.description}
                Required Skills: ${job.requiredSkills.join(", ")}
                
                Candidate Skills: ${applicant.skills.join(", ")}
                
                Return a JSON object EXACTLY in this format with no markdown wrappers:
                {
                  "score": <number 0-100 representing the match strength>,
                  "summary": "<1-2 sentences explaining why they are or aren't a good fit>"
                }
                `;

                try {
                    console.log('🤖 Calling Gemini AI for:', (applicant as any)?.fullName);
                    const result = await model.generateContent(prompt);
                    let responseText = result.response.text().trim();
                    responseText = responseText.replace(/```json/i, "").replace(/```/g, "").trim();

                    const aiData = JSON.parse(responseText);
                    console.log('✅ AI response for', (applicant as any)?.fullName, ':', aiData);

                    app.score = aiData.score || 0;
                    app.aiSummary = aiData.summary || "No summary provided.";
                } catch (err: any) {
                    console.error("❌ Gemini AI error for", (applicant as any)?.fullName, ":", err.message);
                    app.score = 0;
                    app.aiSummary = "Error computing summary.";
                }
            } else {
                console.log('⚠️ No applicant or skills found for application');
                app.score = 0;
                app.aiSummary = "No skills data available.";
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
