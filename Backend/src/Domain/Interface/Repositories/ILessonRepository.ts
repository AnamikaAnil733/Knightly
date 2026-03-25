import LessonEntity from "../../Entity/LessonEntity";
import { LessonCategory, LessonDifficulty } from "../../Types/LessonTypes";

export interface ILessonRepository {
  create(lesson: LessonEntity): Promise<LessonEntity>;
  findAll(filters?: { category?: LessonCategory; difficulty?: LessonDifficulty }): Promise<LessonEntity[]>;
  findById(id: string): Promise<LessonEntity | null>;
  update(id: string, lesson: LessonEntity): Promise<LessonEntity | null>;
  delete(id: string): Promise<void>;
}
