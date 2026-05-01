import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
    userId: Types.ObjectId;
    message: string;
    type: "selected" | "accepted" | "rejected" | "info";
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["selected", "accepted", "rejected", "info"], default: "info" },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Notification = model<INotification>("Notification", notificationSchema);
