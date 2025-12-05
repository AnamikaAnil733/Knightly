import { Schema, Document } from "mongoose";
import { User } from "../../../Domain/Interface/User";
import { UserRole } from "../../../Domain/Types/UserRole";

export interface UserDocument extends Document, User {}

export const UserSchema = new Schema<UserDocument>(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    isBlocked: { type: Boolean, default: false },
    gamesPlayed: { type: Number, default: 0 },
    gamesWin: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    premium: { type: Boolean, default: false },
    longestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    rewards: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    subscriptionStart: { type: Date },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: Object.values(UserRole), required: true },
  },
  { timestamps: true },
);
