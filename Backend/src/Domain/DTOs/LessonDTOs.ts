import { LessonCategory, LessonDifficulty } from "../Types/LessonTypes";

export interface LessonSummaryDTO {
  id: string;
  title: string;
  category: LessonCategory;
  difficulty: LessonDifficulty;
  order: number;
  isPremium: boolean;
}

export interface LessonDetailDTO {
  id: string;
  title: string;
  category: LessonCategory;
  difficulty: LessonDifficulty;
  content: string;
  order: number;
  isPremium: boolean;
  fen?: string;
  createdAt: Date;
  updatedAt: Date;
}
