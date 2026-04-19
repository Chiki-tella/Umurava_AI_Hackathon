import { Job } from "../models/job.model";
import { createJobSchema } from "../utils/validation";

export const createJob = async (payload: unknown) => {
  const parsed = createJobSchema.parse(payload);
  return Job.create(parsed);
};
