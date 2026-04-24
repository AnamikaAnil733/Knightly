import { NextFunction, Request, Response } from "express";
import { IValidateMoveusecase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IValidatePuzzlesMoves";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { IGetPuzzleByDifficulty } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleByDifficultyUseCase";
import { GetPuzzleSchema, ValidatePuzzleMoveSchema } from "../../../Validators/UserValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IGetPuzzleSolveCountUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveCountUseCase";
import { IGetDailyPuzzleUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetDailyPuzzleUseCase";
import { IGetPuzzleSolveHistoryUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveHistoryUseCase";

export class UserPuzzleController {
  constructor(
    private readonly _getPuzzleUsecase: IGetPuzzleByDifficulty,
    private readonly _validateMoves: IValidateMoveusecase,
    private readonly _getSolveCount: IGetPuzzleSolveCountUseCase,
    private readonly _getDailyPuzzle: IGetDailyPuzzleUseCase,
    private readonly _getSolveHistory: IGetPuzzleSolveHistoryUseCase,
  ) {}

  getSolveCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

      const count = await this._getSolveCount.execute(userId);
      return res.status(200).json({ success: true, ...count });
    } catch (error) {
      next(error);
    }
  };

  getSolveHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

      const history = await this._getSolveHistory.execute(userId);
      return res.status(200).json({ success: true, history });
    } catch (error) {
      next(error);
    }
  };

  getDailyPuzzle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

      const puzzle = await this._getDailyPuzzle.execute(userId);
      return res.status(200).json(puzzle);
    } catch (error) {
      next(error);
    }
  };

  getPuzzle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = GetPuzzleSchema.safeParse(req.params);
      if (!validationResult.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          validationResult.error.issues[0].message,
        );
      }
      const userId = (req as any).user?.id;
      if (!userId) throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

      const { difficulty: difficultyParam } = validationResult.data;
      const difficulty = (difficultyParam.charAt(0).toUpperCase() +
        difficultyParam.slice(1).toLowerCase()) as PuzzleType;

      const puzzle = await this._getPuzzleUsecase.execute(userId, difficulty);
      return res.status(200).json(puzzle);
    } catch (error) {
      next(error);
    }
  };

  validateMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = ValidatePuzzleMoveSchema.safeParse({
        ...req.params,
        ...req.body,
      });
      if (!validationResult.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          validationResult.error.issues[0].message,
        );
      }
      const userId = (req as any).user?.id;
      if (!userId) throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);

      const { puzzleId, move, moveIndex } = validationResult.data;

      const result = await this._validateMoves.execute({
        userId,
        puzzleId,
        move,
        moveIndex,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
