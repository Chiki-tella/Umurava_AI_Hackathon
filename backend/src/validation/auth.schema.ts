import { z } from "zod";

export const registerJobSeekerSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    interestedRoles: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
    skills: z.string().optional() // received as comma-separated string
});

export const registerRecruiterSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    companyName: z.string().min(2, "Company name is required")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});
