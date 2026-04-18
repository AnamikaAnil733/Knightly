import { Request, Response, NextFunction } from "express";
import { IGetAllLiveGamesUseCase } from "../../../../Domain/Interface/Usecases/Admin/GameManagement/IGetAllLiveGamesUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class GetAllLiveGamesController {
  constructor(private readonly _getAllLiveGamesUseCase: IGetAllLiveGamesUseCase) {}

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const games = await this._getAllLiveGamesUseCase.execute();
      return res.status(HttpStatusCodes.OK).json(games);
    } catch (error) {
      next(error);
    }
  };
}
