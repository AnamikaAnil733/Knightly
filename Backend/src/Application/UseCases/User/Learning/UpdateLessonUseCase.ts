import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IUpdateLessonUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IUpdateLessonUseCase";
import { LessonDetailDTO } from "../../../../Domain/DTOs/LessonDTOs";
import { LessonCategory, LessonDifficulty } from "../../../../Domain/Types/LessonTypes";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export  class UpdateLessonUseCase implements IUpdateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(id: string, params: {
    title?: string;
    category?: LessonCategory;
    difficulty?: LessonDifficulty;
    content?: string;
    order?: number;
    isPremium?: boolean;
    fen?: string;
  }): Promise<LessonDetailDTO> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found.");

    lesson.update(params);
    const updated = await this.lessonRepository.update(id, lesson);

    if (!updated) throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found after update.");

    return {
      id: updated.id!,
      title: updated.title,
      category: updated.category,
      difficulty: updated.difficulty,
      content: updated.content,
      order: updated.order,
      isPremium: updated.isPremium,
      fen: updated.fen,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
