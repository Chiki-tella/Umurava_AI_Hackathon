import { z } from "zod";

export const applySchema = z.object({
    jobId: z.string().min(1, "Job ID is required"),
    cvUrl: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    portfolio: z.string().optional(),
    skills: z.string().optional()
});

export const selectCandidateSchema = z.object({
    status: z.enum(["selected", "rejected", "pending"])
});
