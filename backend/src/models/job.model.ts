import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  createdBy: Types.ObjectId;
  status: "open" | "closed";
  createdAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  requiredSkills: { type: [String], required: true, default: [] },
  location: { type: String, required: true, trim: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export const Job = model<IJob>("Job", jobSchema);
