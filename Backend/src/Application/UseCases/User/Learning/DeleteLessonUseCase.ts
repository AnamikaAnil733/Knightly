import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IDeleteLessonUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IDeleteLessonUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export default class DeleteLessonUseCase implements IDeleteLessonUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<void> {
    const lesson = await this.lessonRepository.findById(id);
    if (!lesson) throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found.");
    await this.lessonRepository.delete(id);
  }
}
