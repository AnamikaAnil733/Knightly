import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import GetLessonsUseCase from "../../../../Application/UseCases/User/Learning/GetLessonsUseCase";
import GetLessonByIdUseCase from "../../../../Application/UseCases/User/Learning/GetLessonByIdUseCase";
import CreateLessonUseCase from "../../../../Application/UseCases/User/Learning/CreateLessonUseCase";
import UpdateLessonUseCase from "../../../../Application/UseCases/User/Learning/UpdateLessonUseCase";
import DeleteLessonUseCase from "../../../../Application/UseCases/User/Learning/DeleteLessonUseCase";
import { LessonCategory, LessonDifficulty } from "../../../../Domain/Types/LessonTypes";


export class LessonController {
  constructor(
    private getLessonsUseCase: GetLessonsUseCase,
    private getLessonByIdUseCase: GetLessonByIdUseCase,
    private createLessonUseCase: CreateLessonUseCase,
    private updateLessonUseCase: UpdateLessonUseCase,
    private deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  getLessons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, difficulty } = req.query as {
        category?: LessonCategory;
        difficulty?: LessonDifficulty;
      };

      const lessons = await this.getLessonsUseCase.execute({ category, difficulty });
      return res.status(HttpStatusCodes.OK).json({ success: true, lessons });
    } catch (error) {
      next(error);
    }
  };

  getLessonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const lesson = await this.getLessonByIdUseCase.execute(id);
      return res.status(HttpStatusCodes.OK).json({ success: true, lesson });
    } catch (error) {
      next(error);
    }
  };

  createLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, category, difficulty, content, order, fen } = req.body;
      const lesson = await this.createLessonUseCase.execute({ title, category, difficulty, content, order, fen });
      return res.status(HttpStatusCodes.CREATED).json({ success: true, lesson });
    } catch (error) {
      next(error);
    }
  };

  updateLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, category, difficulty, content, order, fen } = req.body;
      const lesson = await this.updateLessonUseCase.execute(id, { title, category, difficulty, content, order, fen });
      return res.status(HttpStatusCodes.OK).json({ success: true, lesson });
    } catch (error) {
      next(error);
    }
  };

  deleteLesson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.deleteLessonUseCase.execute(id);
      return res.status(HttpStatusCodes.OK).json({ success: true, message: "Lesson deleted." });
    } catch (error) {
      next(error);
    }
  };
}
