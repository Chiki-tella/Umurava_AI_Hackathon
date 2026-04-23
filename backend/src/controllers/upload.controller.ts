import { Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AuthRequest } from "../middleware/auth.middleware";

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept PDF files only
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for CV uploads'));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Upload CV endpoint
export const uploadCVFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No CV file uploaded" });
      return;
    }

    const cvUrl = `/uploads/cvs/${req.file.filename}`;
    
    console.log('✅ CV uploaded successfully:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      url: cvUrl,
      uploadedBy: req.user?.email
    });

    res.status(201).json({
      success: true,
      message: "CV uploaded successfully",
      cvUrl,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error: any) {
    console.error('❌ CV upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "CV upload failed" 
    });
  }
};
