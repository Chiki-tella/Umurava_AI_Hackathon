import { z } from "zod";

export const createJobSchema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
    location: z.string().min(2, "Location is required")
});
