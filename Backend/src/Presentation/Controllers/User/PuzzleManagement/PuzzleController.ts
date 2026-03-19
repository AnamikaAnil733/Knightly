import { NextFunction, Request, Response } from "express";
import { IValidateMoveusecase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IValidatePuzzlesMoves";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { IGetPuzzleByDifficulty } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleByDifficultyUseCase";
import { GetPuzzleSchema, ValidatePuzzleMoveSchema } from "../../../Validators/UserValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class UserPuzzleController {
  constructor(
    private readonly _getPuzzleUsecase: IGetPuzzleByDifficulty,
    private readonly _validateMoves: IValidateMoveusecase,
  ) {}

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

      const { puzzleId, move } = validationResult.data;

      const result = await this._validateMoves.execute({
        userId,
        puzzleId,
        move,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
