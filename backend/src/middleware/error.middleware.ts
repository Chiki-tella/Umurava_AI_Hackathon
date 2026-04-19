import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { errorResponse } from "../utils/apiResponse";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json(errorResponse("Route not found"));
};

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0]?.message ?? "Validation error";
    res.status(400).json(errorResponse(firstIssue));
    return;
  }

  if (err instanceof mongoose.Error) {
    res.status(500).json(errorResponse("Database error occurred"));
    return;
  }

  res.status(500).json(errorResponse("Internal server error"));
};
