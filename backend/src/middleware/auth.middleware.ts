import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
            return;
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "default_secret";

        const decoded = jwt.verify(token, secret) as { id: string; role: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized. User not found." });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Unauthorized. Invalid token." });
    }
};
