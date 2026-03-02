import { NextFunction, Request, Response } from "express";
import { IValidateMoveusecase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IValidatePuzzlesMoves";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { IGetPuzzleByDifficulty } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleByDifficultyUseCase";

export class UserPuzzleController {
  constructor(
    private readonly _getPuzzleUsecase: IGetPuzzleByDifficulty,
    private readonly _validateMoves: IValidateMoveusecase
  ) {}

  getPuzzle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new Error("Unauthorized");

      const difficultyParam = req.params.difficulty;
      if (!difficultyParam) throw new Error("Difficulty is required");

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
      const userId = (req as any).user?.id;
      const { puzzleId } = req.params;
      const { move } = req.body;

      if (!userId) throw new Error("Unauthorized");
      if (!puzzleId || !move) {
        throw new Error("PuzzleId and move are required");
      }

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
