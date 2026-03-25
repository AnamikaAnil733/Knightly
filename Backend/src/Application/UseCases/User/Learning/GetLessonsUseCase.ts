import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IGetLessonsUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IGetLessonsUseCase";
import { LessonSummaryDTO } from "../../../../Domain/DTOs/LessonDTOs";
import { LessonCategory, LessonDifficulty } from "../../../../Domain/Types/LessonTypes";

export default class GetLessonsUseCase implements IGetLessonsUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(filters?: { category?: LessonCategory; difficulty?: LessonDifficulty }): Promise<LessonSummaryDTO[]> {
    const lessons = await this.lessonRepository.findAll(filters);

    return lessons
      .sort((a, b) => a.order - b.order)
      .map((lesson) => ({
        id: lesson.id!,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        order: lesson.order,
      }));
  }
}
