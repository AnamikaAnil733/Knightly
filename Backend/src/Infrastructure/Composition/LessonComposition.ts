import { LessonRepository } from "../Repository/LessonRepository";
import { AuthRepository } from "../Repository/AuthRepository";
import { GetLessonsUseCase } from "../../Application/UseCases/User/Learning/GetLessonsUseCase";
import { GetLessonByIdUseCase } from "../../Application/UseCases/User/Learning/GetLessonByIdUseCase";
import { CreateLessonUseCase } from "../../Application/UseCases/User/Learning/CreateLessonUseCase";
import { UpdateLessonUseCase } from "../../Application/UseCases/User/Learning/UpdateLessonUseCase";
import { DeleteLessonUseCase } from "../../Application/UseCases/User/Learning/DeleteLessonUseCase";
import { LessonController } from "../../Presentation/Controllers/User/Learning/LessonController";

const lessonRepository = new LessonRepository();
const authRepository = new AuthRepository();

const getLessonsUseCase = new GetLessonsUseCase(lessonRepository);
const getLessonByIdUseCase = new GetLessonByIdUseCase(lessonRepository, authRepository);
const createLessonUseCase = new CreateLessonUseCase(lessonRepository);
const updateLessonUseCase = new UpdateLessonUseCase(lessonRepository);
const deleteLessonUseCase = new DeleteLessonUseCase(lessonRepository);

export const lessonController = new LessonController(
  getLessonsUseCase,
  getLessonByIdUseCase,
  createLessonUseCase,
  updateLessonUseCase,
  deleteLessonUseCase,
);
