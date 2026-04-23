import { JobSeeker as JobSeekerModel } from "../models/user.model";
import { parseCsvApplicants, parseExcelApplicants } from "../utils/fileParsers";
import { applicantUploadSchema, createApplicantSchema } from "../utils/validation";
import { AppError } from "../utils/AppError";

export const createApplicant = async (payload: unknown) => {
  const parsed = createApplicantSchema.parse(payload);
  return JobSeekerModel.create(parsed);
};

export const createApplicantsFromFile = async (
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new AppError("No file uploaded", 400);
  }

  applicantUploadSchema.parse({ mimetype: file.mimetype });

  const isCsv = file.mimetype === "text/csv";
  const isExcel =
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  if (!isCsv && !isExcel) {
    throw new AppError("Invalid file format. Upload CSV or Excel", 400);
  }

  const parsedApplicants = isCsv
    ? await parseCsvApplicants(file.buffer)
    : parseExcelApplicants(file.buffer);

  return JobSeekerModel.insertMany(parsedApplicants, { ordered: false });
};
