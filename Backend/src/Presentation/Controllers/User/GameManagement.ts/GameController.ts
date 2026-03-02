import { Request, Response, NextFunction } from "express";
import { ICreateGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/ICreateGameUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IGetGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameUseCase";
import { IGetLegalMovesUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetLegalMovesUseCase";
import { IMakeMoveUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IMakeMoveUseCase";

export class GameController {
  constructor(
    private readonly _createGameUseCase: ICreateGameUseCase,
    private readonly _getGameUseCase: IGetGameUseCase,
    private readonly _getLegalMovesUseCase: IGetLegalMovesUseCase,
    private readonly _makeMoveUseCase: IMakeMoveUseCase
  ) {}

  createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
      const GameResponse = await this._createGameUseCase.execute();
      return res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: GameResponse,
      });
    } catch (error: any) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.FAILED_CREATE_GAME,
      });
    }
  };

  getGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId } = req.params;

      if (!gameId) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: "GameId is required" });
        return;
      }
      const response = await this._getGameUseCase.execute(gameId);
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  legalMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId } = req.params;
      const row = Number(req.query.row);
      const col = Number(req.query.col);

      if (!gameId || Number.isNaN(row) || Number.isNaN(col)) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: "Invalid position" });
        return;
      }

      const moves = await this._getLegalMovesUseCase.execute(gameId, {
        row,
        col,
      });

      res.status(HttpStatusCodes.OK).json({ moves });
    } catch (error) {
      next(error);
    }
  };

  makeMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId } = req.params;
      const { from, to, promotionType } = req.body;
      console.log(from, to, promotionType);
      if (
        !gameId ||
        !from ||
        !to ||
        typeof from.row !== "number" ||
        typeof from.col !== "number" ||
        typeof to.row !== "number" ||
        typeof to.col !== "number"
      ) {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: "Invalid move data" });
        return;
      }

      await this._makeMoveUseCase.execute(gameId, from, to, promotionType);
      res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  };
}
