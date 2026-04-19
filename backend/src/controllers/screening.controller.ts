import { Request, Response } from "express";
import {
  getResultsByJobId,
  screenApplicantsForJob
} from "../services/screening.service";
import { successResponse } from "../utils/apiResponse";

export const screenApplicantsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const results = await screenApplicantsForJob(String(req.params.jobId));
  res.status(200).json(successResponse(results));
};

export const getResultsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const results = await getResultsByJobId(String(req.params.jobId));
  res.status(200).json(successResponse(results));
};
