import { Schema, Document, model } from "mongoose";
import { LessonCategory, LessonDifficulty } from "../../../Domain/Types/LessonTypes";

export interface LessonDocument extends Document {
  title: string;
  category: LessonCategory;
  difficulty: LessonDifficulty;
  content: string;
  order: number;
  fen?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<LessonDocument>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(LessonCategory),
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(LessonDifficulty),
      required: true,
    },
    content: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    fen: { type: String, required: false },
  },
  { timestamps: true },
);

export const LessonModel = model<LessonDocument>("Lesson", LessonSchema);
