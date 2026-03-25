import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IGetLessonByIdUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IGetLessonByIdUseCase";
import { LessonDetailDTO } from "../../../../Domain/DTOs/LessonDTOs";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class GetLessonByIdUseCase implements IGetLessonByIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<LessonDetailDTO> {
    const lesson = await this.lessonRepository.findById(id);

    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found.");
    }

    return {
      id: lesson.id!,
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      content: lesson.content,
      order: lesson.order,
      fen: lesson.fen,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
