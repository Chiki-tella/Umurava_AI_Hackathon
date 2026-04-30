import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, JobSeeker, Recruiter, Admin } from "../models/user.model";
import { registerJobSeekerSchema, registerRecruiterSchema, loginSchema } from "../validation/auth.schema";
import { AuthRequest } from "../middleware/auth.middleware";

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "7d",
    });
};

const formatError = (error: any, defaultMessage: string): string => {
    if (error.errors && Array.isArray(error.errors)) {
        return error.errors.map((e: any) => e.message).join(", ");
    }
    try {
        const parsed = JSON.parse(error.message);
        if (Array.isArray(parsed) && parsed[0]?.message) {
            return parsed.map((e: any) => e.message).join(", ");
        }
    } catch (e) {}
    return error.message || defaultMessage;
};

export const registerJobSeeker = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = registerJobSeekerSchema.parse(req.body);
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email already in use" });
            return;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        let skillsArray: string[] = [];
        if (data.skills) {
            skillsArray = data.skills.split(",").map(s => s.trim()).filter(s => s);
        }

        const user = await JobSeeker.create({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: "jobseeker",
            interestedRoles: data.interestedRoles || [],
            preferredLocations: data.preferredLocations || [],
            skills: skillsArray,
        });

        const token = generateToken(user.id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: formatError(error, "Registration failed") });
    }
};

export const registerRecruiter = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = registerRecruiterSchema.parse(req.body);
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Email already in use" });
            return;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await Recruiter.create({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: "recruiter",
            companyName: data.companyName,
        });

        const token = generateToken(user.id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: formatError(error, "Registration failed") });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = loginSchema.parse(req.body);
        
        console.log('🔍 Login attempt for:', data.email);
        
        // Try to find user using the base User model first (most reliable)
        let user = await User.findOne({ email: data.email });
        
        // If not found in base User model, try discriminators
        if (!user) {
            console.log('🔍 Not found in User model, trying JobSeeker...');
            user = await JobSeeker.findOne({ email: data.email });
        }
        if (!user) {
            console.log('🔍 Not found in JobSeeker, trying Recruiter...');
            user = await Recruiter.findOne({ email: data.email });
        }
        if (!user) {
            console.log('🔍 Not found in Recruiter, trying Admin...');
            user = await Admin.findOne({ email: data.email });
        }
        
        if (!user) {
            console.log('❌ User not found:', data.email);
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        console.log('✅ User found:', user.email, 'Role:', user.role);
        
        const isMatch = await bcrypt.compare(data.password, user.password as string);
        if (!isMatch) {
            console.log('❌ Password mismatch for:', data.email);
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        console.log('✅ Password match successful for:', data.email);

        const token = generateToken(user.id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error: any) {
        console.error('❌ Login error:', {
            name: error.name,
            message: error.message,
            issues: error.issues,
            statusCode: error.statusCode,
            requestBody: req.body,
            headers: req.headers
        });
        res.status(400).json({ 
            success: false, 
            message: formatError(error, "Login failed"),
            details: error.issues || null
        });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to get user profile" });
    }
};
