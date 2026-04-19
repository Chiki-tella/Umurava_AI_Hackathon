import { Document, Schema, model } from "mongoose";

export interface IApplicant extends Document {
  name: string;
  email: string;
  skills: string[];
  experience: number;
  education: string;
  resumeUrl?: string;
  createdAt: Date;
}

const applicantSchema = new Schema<IApplicant>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  skills: { type: [String], required: true, default: [] },
  experience: { type: Number, required: true, min: 0 },
  education: { type: String, required: true, trim: true },
  resumeUrl: { type: String, required: false, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const Applicant = model<IApplicant>("Applicant", applicantSchema);
