import LessonEntity from "../../Domain/Entity/LessonEntity";
import { LessonSummaryDTO, LessonDetailDTO } from "../../Domain/DTOs/LessonDTOs";

export class LessonMapper {
  static toSummaryDTO(lesson: LessonEntity): LessonSummaryDTO {
    return {
      id: lesson.id!,
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      order: lesson.order,
      isPremium: lesson.isPremium,
    };
  }

  static toDetailDTO(lesson: LessonEntity): LessonDetailDTO {
    return {
      id: lesson.id!,
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      content: lesson.content,
      order: lesson.order,
      isPremium: lesson.isPremium,
      fen: lesson.fen,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
