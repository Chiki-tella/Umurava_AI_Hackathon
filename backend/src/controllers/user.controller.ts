import { Response } from "express";
import { User, JobSeeker, Recruiter } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { updateProfileSchema } from "../validation/user.schema";

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log('📝 Profile update request body:', req.body);
        
        // Check if request body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            console.log('❌ Empty request body received');
            res.status(400).json({ 
                success: false, 
                message: "Request body is required. Please provide at least one field to update." 
            });
            return;
        }

        // Validate request body
        const validatedData = updateProfileSchema.parse(req.body);
        const userId = req.user!.id;
        const userRole = req.user!.role;
        const { fullName, interestedRoles, preferredLocations, skills, companyName } = validatedData;

        console.log(`🔄 Updating profile for user: ${userId}, role: ${userRole}`);

        let updatedUser;

        if (userRole === 'jobseeker') {
            // Convert skills string to array if provided
            let skillsArray: string[] = [];
            if (skills) {
                if (typeof skills === 'string') {
                    skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
                } else if (Array.isArray(skills)) {
                    skillsArray = skills;
                }
            }

            updatedUser = await JobSeeker.findByIdAndUpdate(
                userId,
                {
                    fullName: fullName || req.user!.fullName,
                    interestedRoles: interestedRoles || [],
                    preferredLocations: preferredLocations || [],
                    skills: skillsArray,
                },
                { new: true, runValidators: true }
            );
        } else if (userRole === 'recruiter') {
            updatedUser = await Recruiter.findByIdAndUpdate(
                userId,
                {
                    fullName: fullName || req.user!.fullName,
                    companyName: companyName || (req.user as any)?.companyName,
                },
                { new: true, runValidators: true }
            );
        } else {
            // Admin or base user
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { fullName: fullName || req.user!.fullName },
                { new: true, runValidators: true }
            );
        }

        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        console.log(`✅ Profile updated successfully for: ${updatedUser.fullName}`);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                ...(updatedUser.role === 'jobseeker' && {
                    interestedRoles: (updatedUser as any).interestedRoles,
                    preferredLocations: (updatedUser as any).preferredLocations,
                    skills: (updatedUser as any).skills,
                }),
                ...(updatedUser.role === 'recruiter' && {
                    companyName: (updatedUser as any).companyName,
                }),
            }
        });
    } catch (error: any) {
        console.error('❌ Profile update error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            errors: error.errors,
            statusCode: error.statusCode,
            body: req.body,
            user: req.user,
            validationError: error.issues
        });
        res.status(400).json({ 
            success: false, 
            message: error.message || "Profile update failed",
            details: error.errors || error.issues || null
        });
    }
};
