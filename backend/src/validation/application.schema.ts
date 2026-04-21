import { z } from "zod";

export const applySchema = z.object({
    jobId: z.string().min(1, "Job ID is required"),
    cvUrl: z.string().optional()
});

export const selectCandidateSchema = z.object({
    status: z.enum(["selected", "rejected", "pending"])
});
