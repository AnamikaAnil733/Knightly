import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { ICreateLessonUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/ICreateLessonUseCase";
import { LessonDetailDTO } from "../../../../Domain/DTOs/LessonDTOs";
import LessonEntity from "../../../../Domain/Entity/LessonEntity";
import { LessonCategory, LessonDifficulty } from "../../../../Domain/Types/LessonTypes";

export default class CreateLessonUseCase implements ICreateLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(params: {
    title: string;
    category: LessonCategory;
    difficulty: LessonDifficulty;
    content: string;
    order: number;
    fen?: string;
  }): Promise<LessonDetailDTO> {
    const lesson = new LessonEntity(params);
    const created = await this.lessonRepository.create(lesson);

    return {
      id: created.id!,
      title: created.title,
      category: created.category,
      difficulty: created.difficulty,
      content: created.content,
      order: created.order,
      fen: created.fen,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
