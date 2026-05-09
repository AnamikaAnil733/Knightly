import { Request, Response, NextFunction } from "express";
import { ICreateGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/ICreateGameUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IGetGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameUseCase";
import { IGetLegalMovesUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetLegalMovesUseCase";
import { IMakeMoveUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IMakeMoveUseCase";
import { IReviewGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IReviewGameUseCase";
import { IGetLivePublicGamesUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetLivePublicGamesUseCase";
import {
  CreateGameSchema,
  GetGameSchema,
  LegalMoveSchema,
  MakeMoveSchema,
  ReviewGameSchema,
} from "../../../Validators/UserValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import IGetGameHistoryUseCase from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameHistoryUseCase";

export class GameController {
  constructor(
    private readonly _createGameUseCase: ICreateGameUseCase,
    private readonly _getGameUseCase: IGetGameUseCase,
    private readonly _getLegalMovesUseCase: IGetLegalMovesUseCase,
    private readonly _makeMoveUseCase: IMakeMoveUseCase,
    private readonly _reviewGameUseCase: IReviewGameUseCase,
    private readonly _getGameHistoryUseCase: IGetGameHistoryUseCase,
    private readonly _getLivePublicGamesUseCase: IGetLivePublicGamesUseCase,
  ) {}

  getLiveGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const games = await this._getLivePublicGamesUseCase.execute();
      res.status(HttpStatusCodes.OK).json({ success: true, data: games });
    } catch (error) {
      next(error);
    }
  };


  createGame = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = CreateGameSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }
      const { timeControl } = result.data;
      const GameResponse = await this._createGameUseCase.execute(
        "",
        "",
        timeControl,
      );
      return res.status(HttpStatusCodes.CREATED).json({
        success: true,
        data: GameResponse,
      });
    } catch (error: any) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || MESSAGES.FAILED_CREATE_GAME,
      });
    }
  };

  getGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = GetGameSchema.safeParse(req.params);

      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }
      const { gameId } = result.data;
      const response = await this._getGameUseCase.execute(gameId);
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  legalMove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = LegalMoveSchema.safeParse({
        ...req.params,
        ...req.query,
      });

      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const { gameId, row, col } = result.data;

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
      const result = MakeMoveSchema.safeParse({
        ...req.params,
        ...req.body,
      });
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const { gameId, from, to, promotionType } = result.data;

      await this._makeMoveUseCase.execute(gameId, from, to, promotionType);
      res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  };

  reviewGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = ReviewGameSchema.safeParse(req.params);

      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          result.error.issues[0].message,
        );
      }

      const { gameId } = result.data;
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.UNAUTHORIZED,
        );
      }

      const analysis = await this._reviewGameUseCase.execute(gameId, userId);
      res.status(HttpStatusCodes.OK).json({ success: true, analysis });
    } catch (error) {
      next(error);
    }
  };

  getGameHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.UNAUTHORIZED,
        );
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this._getGameHistoryUseCase.execute(
        userId,
        page,
        limit,
      );
      res.status(HttpStatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
