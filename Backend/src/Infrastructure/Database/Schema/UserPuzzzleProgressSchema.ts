import { Schema } from "mongoose";

export interface UserPuzzleProgressSchemaType {
  userId: string;
  puzzleId: string;
  solved?: boolean;
  attempts?: number;
  solvedAt?: Date;
}

export const UserPuzzleProgressSchema =
  new Schema<UserPuzzleProgressSchemaType>(
    {
      userId: { type: String, required: true },
      puzzleId: { type: String, required: true },
      solved: { type: Boolean, default: false },
      attempts: { type: Number, default: 0 },
      solvedAt: { type: Date },
    },
    { timestamps: true }
  );

UserPuzzleProgressSchema.index({ userId: 1, puzzleId: 1 }, { unique: true });
