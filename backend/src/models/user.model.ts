import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    role: "jobseeker" | "recruiter" | "admin";
    createdAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["jobseeker", "recruiter", "admin"], required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { discriminatorKey: "role", timestamps: true }
);

export const User = model<IUser>("User", userSchema);

export interface IJobSeeker extends IUser {
    interestedRoles: string[];
    preferredLocations: string[];
    skills: string[];
    githubUrl?: string;
}
const jobSeekerSchema = new Schema<IJobSeeker>({
    interestedRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    githubUrl: { type: String, trim: true },
});
export const JobSeeker = User.discriminator<IJobSeeker>("jobseeker", jobSeekerSchema);

export interface IRecruiter extends IUser {
    companyName: string;
    companyWebsite?: string;
}
const recruiterSchema = new Schema<IRecruiter>({
    companyName: { type: String, required: true },
    companyWebsite: { type: String },
});
export const Recruiter = User.discriminator<IRecruiter>("recruiter", recruiterSchema);

export interface IAdmin extends IUser {
    // Admin users don't need additional fields for now
}
const adminSchema = new Schema<IAdmin>({
    // Add admin-specific fields if needed in the future
});
export const Admin = User.discriminator<IAdmin>("admin", adminSchema);
