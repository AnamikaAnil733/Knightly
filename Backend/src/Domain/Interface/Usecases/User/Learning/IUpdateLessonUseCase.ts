import { LessonCategory, LessonDifficulty } from "../../../../Types/LessonTypes";
import { LessonDetailDTO } from "../../../../DTOs/LessonDTOs";

export interface IUpdateLessonUseCase {
  execute(id: string, params: {
    title?: string;
    category?: LessonCategory;
    difficulty?: LessonDifficulty;
    content?: string;
    order?: number;
    fen?: string;
  }): Promise<LessonDetailDTO>;
}
