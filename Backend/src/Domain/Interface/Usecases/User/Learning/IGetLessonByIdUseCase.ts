import { LessonDetailDTO } from "../../../../DTOs/LessonDTOs";

export interface IGetLessonByIdUseCase {
  execute(id: string, userId?: string): Promise<LessonDetailDTO>;
}
