import { Types } from "mongoose";
import { screenCandidates } from "../ai/gemini.service";
import { Applicant } from "../models/applicant.model";
import { Job } from "../models/job.model";
import { ScreeningResult } from "../models/screeningResult.model";
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

  const applicants = await Applicant.find().sort({ createdAt: -1 });
  if (applicants.length === 0) {
    throw new AppError("No applicants available for screening", 400);
  }

  const aiResults = await screenCandidates(job, applicants);

  const applicantsByName = new Map(
    applicants.map((applicant) => [applicant.name.toLowerCase(), applicant])
  );

  const normalized = aiResults
    .map((candidate) => {
      const applicant = applicantsByName.get(candidate.name.toLowerCase());
      if (!applicant) return null;
      return {
        applicantId: applicant._id,
        score: candidate.score,
        strengths: candidate.strengths ?? [],
        gaps: candidate.gaps ?? [],
        recommendation: candidate.recommendation || "No recommendation provided",
        rank: candidate.rank
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_LIMIT)
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));

  await ScreeningResult.deleteMany({ jobId });

  const inserted = await ScreeningResult.insertMany(
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

  return ScreeningResult.find({ jobId })
    .populate("applicantId")
    .sort({ rank: 1, score: -1 });
};
