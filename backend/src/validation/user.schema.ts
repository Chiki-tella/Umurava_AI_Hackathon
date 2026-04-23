import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().min(2).max(100).optional(),
    interestedRoles: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
    skills: z.union([z.string(), z.array(z.string())]).optional(),
    companyName: z.string().min(2).max(100).optional(),
    githubUrl: z.string().url().or(z.literal("")).optional(),
});
