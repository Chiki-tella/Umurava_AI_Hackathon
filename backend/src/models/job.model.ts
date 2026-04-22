import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  companyName: string;
  companyWebsite?: string;
  salary?: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship" | "remote";
  experience?: string;
  education?: string;
  createdBy: Types.ObjectId;
  status: "open" | "closed";
  createdAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  requiredSkills: { type: [String], required: true, default: [] },
  location: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  salary: { type: String, trim: true },
  employmentType: { type: String, enum: ["full-time", "part-time", "contract", "internship", "remote"], default: "full-time" },
  experience: { type: String, trim: true },
  education: { type: String, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export const Job = model<IJob>("Job", jobSchema);
