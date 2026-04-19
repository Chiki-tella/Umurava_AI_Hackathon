import csv from "csv-parser";
import { Readable } from "stream";
import xlsx from "xlsx";
import { applicantsBulkSchema } from "./validation";
import { AppError } from "./AppError";

type RawRow = Record<string, unknown>;

const normalizeApplicantRow = (row: RawRow) => ({
  name: String(row.name ?? "").trim(),
  email: String(row.email ?? "").trim(),
  skills: String(row.skills ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  experience: Number(row.experience ?? 0),
  education: String(row.education ?? "").trim(),
  resumeUrl: row.resumeUrl ? String(row.resumeUrl).trim() : undefined
});

export const parseCsvApplicants = async (buffer: Buffer) => {
  const rows: RawRow[] = [];

  await new Promise<void>((resolve, reject) => {
    const stream = Readable.from(buffer.toString());
    stream
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("error", reject)
      .on("end", () => resolve());
  });

  return applicantsBulkSchema.parse(rows.map(normalizeApplicantRow));
};

export const parseExcelApplicants = (buffer: Buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new AppError("Excel file is empty", 400);
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const jsonRows = xlsx.utils.sheet_to_json<RawRow>(worksheet, { defval: "" });
  return applicantsBulkSchema.parse(jsonRows.map(normalizeApplicantRow));
};
