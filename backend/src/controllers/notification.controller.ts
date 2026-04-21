import { Response } from "express";
import { Notification } from "../models/notification.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ userId: req.user!.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, notifications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            res.status(404).json({ success: false, message: "Notification not found" });
            return;
        }

        if (notification.userId.toString() !== req.user!.id) {
            res.status(403).json({ success: false, message: "Forbidden. Not your notification." });
            return;
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ success: true, notification });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Failed to update notification" });
    }
};
