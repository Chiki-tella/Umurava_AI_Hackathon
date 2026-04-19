import { Request, Response } from "express";
import {
  createApplicant,
  createApplicantsFromFile
} from "../services/applicant.service";
import { successResponse } from "../utils/apiResponse";

export const createApplicantController = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (req.file) {
    const applicants = await createApplicantsFromFile(req.file);
    res.status(201).json(successResponse(applicants));
    return;
  }

  const applicant = await createApplicant(req.body);
  res.status(201).json(successResponse(applicant));
};
