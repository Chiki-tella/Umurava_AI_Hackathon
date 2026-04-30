import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
    jobId: Types.ObjectId;
    applicantId: Types.ObjectId;
    cvUrl?: string; // Store metadata only
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    experience?: string;
    education?: string;
    portfolio?: string;
    skills?: string;
    coverLetter?: string;
    status: "pending" | "selected" | "rejected";
    score?: number; // AI ranking score
    aiSummary?: string; // Gemini AI Summary
    github?: string; // Extracted from CV
    createdAt: Date;
}

const applicationSchema = new Schema<IApplication>({
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cvUrl: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    experience: { type: String },
    education: { type: String },
    portfolio: { type: String, trim: true },
    skills: { type: String },
    coverLetter: { type: String },
    status: { type: String, enum: ["pending", "selected", "rejected"], default: "pending" },
    score: { type: Number, min: 0, max: 100 },
    aiSummary: { type: String },
    github: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
});

export const Application = model<IApplication>("Application", applicationSchema);
