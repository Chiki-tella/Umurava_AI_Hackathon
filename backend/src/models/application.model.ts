import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
    jobId: Types.ObjectId;
    applicantId: Types.ObjectId;
    cvUrl?: string; // Store metadata only
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
    status: { type: String, enum: ["pending", "selected", "rejected"], default: "pending" },
    score: { type: Number, min: 0, max: 100 },
    aiSummary: { type: String },
    github: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
});

export const Application = model<IApplication>("Application", applicationSchema);
