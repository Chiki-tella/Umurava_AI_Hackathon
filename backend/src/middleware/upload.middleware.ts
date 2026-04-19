import multer from "multer";
import { AppError } from "../utils/AppError";

const allowedMimeTypes = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

const storage = multer.memoryStorage();

export const uploadApplicantsFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError("Only CSV and Excel files are supported", 400));
      return;
    }
    cb(null, true);
  }
}).single("file");
