import { Document, Schema, Types, model } from "mongoose";

export interface IScreeningResult extends Document {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  rank: number;
  createdAt: Date;
}

const screeningResultSchema = new Schema<IScreeningResult>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
  applicantId: {
    type: Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
    index: true
  },
  score: { type: Number, required: true, min: 0, max: 100 },
  strengths: { type: [String], required: true, default: [] },
  gaps: { type: [String], required: true, default: [] },
  recommendation: { type: String, required: true, trim: true },
  rank: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

screeningResultSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export const ScreeningResult = model<IScreeningResult>(
  "ScreeningResult",
  screeningResultSchema
);
