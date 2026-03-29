import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IGetLessonByIdUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IGetLessonByIdUseCase";
import { LessonDetailDTO } from "../../../../Domain/DTOs/LessonDTOs";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

import { LessonMapper } from "../../../Mapper/LessonMapper";

export default class GetLessonByIdUseCase implements IGetLessonByIdUseCase {
  constructor(private lessonRepository: ILessonRepository) {}

  async execute(id: string): Promise<LessonDetailDTO> {
    const lesson = await this.lessonRepository.findById(id);

    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found.");
    }

    return LessonMapper.toDetailDTO(lesson);
  }
}
