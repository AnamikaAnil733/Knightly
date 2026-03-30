import { LessonCategory, LessonDifficulty } from "../../Types/LessonTypes";
import { LessonSummaryDTO } from "../../DTOs/LessonDTOs";

export interface IGetLessonsUseCase {
  execute(filters?: { category?: LessonCategory; difficulty?: LessonDifficulty }): Promise<LessonSummaryDTO[]>;
}
