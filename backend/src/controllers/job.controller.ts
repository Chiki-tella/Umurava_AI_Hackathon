import { Request, Response } from "express";
import { createJob } from "../services/job.service";
import { successResponse } from "../utils/apiResponse";

export const createJobController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const job = await createJob(req.body);
  res.status(201).json(successResponse(job));
};
