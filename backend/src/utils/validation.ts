import { z } from "zod";

const skillsSchema = z
  .union([z.array(z.string()), z.string()])
  .transform((value) =>
    Array.isArray(value)
      ? value.map((skill) => skill.trim()).filter(Boolean)
      : value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
  );

export const createJobSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  requiredSkills: skillsSchema,
  experienceLevel: z.string().trim().min(2)
});

export const createApplicantSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim(),
  skills: skillsSchema,
  experience: z.coerce.number().min(0),
  education: z.string().trim().min(2),
  resumeUrl: z.string().url().optional()
});

export const applicantsBulkSchema = z.array(createApplicantSchema).min(1);

export const applicantUploadSchema = z.object({
  mimetype: z.enum([
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ])
});

export const aiCandidateResultSchema = z.object({
  name: z.string().min(1),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  recommendation: z.string().min(1),
  rank: z.number().int().min(1)
});

export const aiScreeningResponseSchema = z.array(aiCandidateResultSchema).min(1);
