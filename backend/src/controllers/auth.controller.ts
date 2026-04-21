import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, JobSeeker, Recruiter } from "../models/user.model";
import { registerJobSeekerSchema, registerRecruiterSchema, loginSchema } from "../validation/auth.schema";
import { AuthRequest } from "../middleware/auth.middleware";

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "7d",
    });
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
        res.status(400).json({ success: false, message: error.message || "Registration failed" });
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
        res.status(400).json({ success: false, message: error.message || "Registration failed" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await User.findOne({ email: data.email });
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(data.password, user.password as string);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }

        const token = generateToken(user.id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || "Login failed" });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to get user profile" });
    }
};
