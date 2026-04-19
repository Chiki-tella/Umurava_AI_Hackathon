import { Schema, model, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: string;
  createdAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  requiredSkills: { type: [String], required: true, default: [] },
  experienceLevel: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

export const Job = model<IJob>("Job", jobSchema);
