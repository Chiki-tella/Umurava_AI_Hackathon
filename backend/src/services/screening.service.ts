import { Types } from "mongoose";
import { screenCandidates } from "../ai/gemini.service";
import { JobSeeker as JobSeekerModel } from "../models/user.model";
import { Job } from "../models/job.model";
import { Application } from "../models/application.model";
import { AppError } from "../utils/AppError";

const TOP_LIMIT = 10;

export const screenApplicantsForJob = async (jobId: string) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new AppError("Invalid job id", 400);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const applicants = await JobSeekerModel.find().sort({ createdAt: -1 });
  if (applicants.length === 0) {
    throw new AppError("No applicants available for screening", 400);
  }

  const aiResults = await screenCandidates(job, applicants);

  const applicantsByName = new Map(
    applicants.map((applicant: any) => [applicant.fullName.toLowerCase(), applicant])
  );

  const normalized = aiResults
    .map((candidate) => {
      const applicant = applicantsByName.get(candidate.name.toLowerCase());
      if (!applicant) return null;
      return {
        applicantId: (applicant as any)._id,
        score: candidate.score,
        aiSummary: candidate.recommendation || "No recommendation provided",
        status: "pending" as const
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_LIMIT);

  await Application.deleteMany({ jobId });

  const inserted = await Application.insertMany(
    normalized.map((candidate) => ({
      jobId,
      ...candidate
    }))
  );

  return inserted;
};

export const getResultsByJobId = async (jobId: string) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new AppError("Invalid job id", 400);
  }

  return Application.find({ jobId })
    .populate("applicantId")
    .sort({ score: -1 });
};
