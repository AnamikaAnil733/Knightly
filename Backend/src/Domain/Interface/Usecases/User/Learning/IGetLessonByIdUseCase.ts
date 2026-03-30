import { LessonDetailDTO } from "../../DTOs/LessonDTOs";

export interface IGetLessonByIdUseCase {
  execute(id: string): Promise<LessonDetailDTO>;
}
