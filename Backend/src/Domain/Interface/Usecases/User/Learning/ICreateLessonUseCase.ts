import { LessonCategory, LessonDifficulty } from "../../Types/LessonTypes";
import { LessonDetailDTO } from "../../DTOs/LessonDTOs";

export interface ICreateLessonUseCase {
  execute(params: {
    title: string;
    category: LessonCategory;
    difficulty: LessonDifficulty;
    content: string;
    order: number;
    fen?: string;
  }): Promise<LessonDetailDTO>;
}
