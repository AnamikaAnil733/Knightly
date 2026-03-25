import { LessonRepository } from "../Repository/LessonRepository";
import GetLessonsUseCase from "../../Application/UseCases/User/Learning/GetLessonsUseCase";
import GetLessonByIdUseCase from "../../Application/UseCases/User/Learning/GetLessonByIdUseCase";
import CreateLessonUseCase from "../../Application/UseCases/User/Learning/CreateLessonUseCase";
import UpdateLessonUseCase from "../../Application/UseCases/User/Learning/UpdateLessonUseCase";
import DeleteLessonUseCase from "../../Application/UseCases/User/Learning/DeleteLessonUseCase";
import { LessonController } from "../../Presentation/Controllers/User/Learning/LessonController";

const lessonRepository = new LessonRepository();

const getLessonsUseCase = new GetLessonsUseCase(lessonRepository);
const getLessonByIdUseCase = new GetLessonByIdUseCase(lessonRepository);
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
