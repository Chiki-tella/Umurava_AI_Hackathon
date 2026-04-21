import { Request, Response } from "express";
import { Job, IJob } from "../models/job.model";
import { createJobSchema } from "../validation/job.schema";
import { AuthRequest } from "../middleware/auth.middleware";
import { JobSeeker } from "../models/user.model";


// Recruiter: Create Job
export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createJobSchema.parse(req.body);
    const job = await Job.create({
      ...data,
      createdBy: req.user!.id,
    });
    res.status(201).json({ success: true, job });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || "Failed to create job" });
  }
};

// Recruiter: View own jobs
export const getRecruiterJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ createdBy: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// JobSeeker: Browse all jobs with filtering
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, location, skills } = req.query;

    const query: Record<string, any> = { status: "open" };

    if (title) {
      query.title = { $regex: title.toString(), $options: "i" };
    }

    if (location) {
      query.location = { $regex: location.toString(), $options: "i" };
    }

    if (skills) {
      const skillsArray = skills.toString().split(',').map(s => s.trim()).filter(s => s);
      query.requiredSkills = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// JobSeeker: Get Job Details
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: "Job not found" });
      return;
    }
    res.status(200).json({ success: true, job });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
};

// JobSeeker: Get Recommended Jobs
export const getRecommendedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobSeeker = await JobSeeker.findById(req.user!.id);
    if (!jobSeeker) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const { interestedRoles, preferredLocations, skills } = jobSeeker;

    const jobs = await Job.find({ status: "open" }).lean();

    const scoredJobs = jobs.map(job => {
      let score = 0;

      // Match title/roles
      if (interestedRoles && interestedRoles.length > 0) {
        let maxRoleScore = 0;
        interestedRoles.forEach(role => {
          if (job.title.toLowerCase().includes(role.toLowerCase())) maxRoleScore = 30;
        });
        score += maxRoleScore;
      }

      // Match location
      if (preferredLocations && preferredLocations.length > 0) {
        if (preferredLocations.some(l => l.toLowerCase() === job.location.toLowerCase())) {
          score += 30;
        } else if (job.location.toLowerCase().includes('remote') && preferredLocations.some(l => l.toLowerCase() === 'remote')) {
          score += 30;
        } else if (preferredLocations.some(l => job.location.toLowerCase().includes(l.toLowerCase()))) {
          score += 15;
        }
      }

      // Match skills
      if (skills && skills.length > 0 && job.requiredSkills && job.requiredSkills.length > 0) {
        let matchedSkills = 0;
        job.requiredSkills.forEach(reqSkill => {
          if (skills.some(userSkill => userSkill.toLowerCase() === reqSkill.toLowerCase())) {
            matchedSkills++;
          }
        });
        score += (matchedSkills / job.requiredSkills.length) * 40;
      }

      return { ...job, matchScore: Math.round(score) };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    const relevantJobs = scoredJobs.filter(j => j.matchScore > 0);

    res.status(200).json({ success: true, count: relevantJobs.length, jobs: relevantJobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to get recommendations" });
  }
};
