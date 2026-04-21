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

        const job = await Job.findById(data.jobId);
        if (!job) {
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }

        const existingApplication = await Application.findOne({ jobId: data.jobId, applicantId: req.user!.id });
        if (existingApplication) {
            res.status(400).json({ success: false, message: "You have already applied for this job" });
            return;
        }

        const application = await Application.create({
            jobId: data.jobId,
            applicantId: req.user!.id,
            cvUrl: data.cvUrl || "mock_cv_url.pdf",
        });

        res.status(201).json({ success: true, application });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Failed to apply to job" });
    }
};

// JobSeeker: View Own Applications
export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const applications = await Application.find({ applicantId: req.user!.id })
            .populate("jobId", "title location status")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
};

// Recruiter: View Applicants for a Job
export const getJobApplications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }

        if (job.createdBy.toString() !== req.user!.id) {
            res.status(403).json({ success: false, message: "Forbidden. You do not own this job." });
            return;
        }

        const applications = await Application.find({ jobId })
            .populate("applicantId", "fullName email skills")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, applications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
};

// Recruiter: AI Screening (Mock)
export const screenApplicants = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);

        if (!job) {
            res.status(404).json({ success: false, message: "Job not found" });
            return;
        }

        if (job.createdBy.toString() !== req.user!.id) {
            res.status(403).json({ success: false, message: "Forbidden. You do not own this job." });
            return;
        }

        const applications = await Application.find({ jobId }).populate("applicantId");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        // Use gemini-flash-latest since older models dropped mapping support for this specific credential
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: { responseMimeType: "application/json" }
        });

        for (let app of applications) {
            const applicant = await JobSeeker.findById(app.applicantId);

            if (applicant) {
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
                    const result = await model.generateContent(prompt);
                    let responseText = result.response.text().trim();
                    responseText = responseText.replace(/```json/i, "").replace(/```/g, "").trim();

                    const aiData = JSON.parse(responseText);

                    app.score = aiData.score || 0;
                    app.aiSummary = aiData.summary || "No summary provided.";
                } catch (err: any) {
                    console.error("Gemini AI error:", err.message);
                    app.score = 0;
                    app.aiSummary = "Error computing summary.";
                }
            }

            await app.save();
        }

        const rankedApplications = await Application.find({ jobId })
            .populate("applicantId", "fullName email skills")
            .sort({ score: -1 });

        res.status(200).json({ success: true, applications: rankedApplications });
    } catch (error: any) {
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
