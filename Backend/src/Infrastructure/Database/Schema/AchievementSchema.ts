import { Schema, Document } from "mongoose";

export interface AchievementDocument extends Document {
  title: string;
  description: string;
  icon: string;
  criteriaType: 'GAMES_WON' | 'GAMES_PLAYED' | 'PUZZLES_SOLVED' | 'STREAK_DAYS';
  criteriaValue: number;
  createdAt: Date;
}

export const AchievementSchema = new Schema<AchievementDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Trophy' },
  criteriaType: { 
    type: String, 
    enum: ['GAMES_WON', 'GAMES_PLAYED', 'PUZZLES_SOLVED', 'STREAK_DAYS'], 
    required: true 
  },
  criteriaValue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
