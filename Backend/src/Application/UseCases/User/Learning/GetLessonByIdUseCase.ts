import { ILessonRepository } from "../../../../Domain/Interface/Repositories/ILessonRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { IGetLessonByIdUseCase } from "../../../../Domain/Interface/Usecases/User/Learning/IGetLessonByIdUseCase";
import { LessonDetailDTO } from "../../../../Domain/DTOs/LessonDTOs";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

import { LessonMapper } from "../../../Mapper/LessonMapper";

export default class GetLessonByIdUseCase implements IGetLessonByIdUseCase {
  constructor(
    private lessonRepository: ILessonRepository,
    private userRepository: IBaseRepository<EAuth, string>
  ) {}

  async execute(id: string, userId?: string): Promise<LessonDetailDTO> {
    const lesson = await this.lessonRepository.findById(id);

    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "Lesson not found.");
    }

    if (lesson.isPremium && userId) {
      const user = await this.userRepository.findById(userId);
      if (!user || !user.premium) {
        throw new CustomError(HttpStatusCodes.FORBIDDEN, "Premium membership required to access this lesson.");
      }
    } else if (lesson.isPremium && !userId) {
       throw new CustomError(HttpStatusCodes.FORBIDDEN, "Login and Premium membership required.");
    }

    return LessonMapper.toDetailDTO(lesson);
  }
}
