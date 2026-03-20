import { Request, Response, NextFunction } from "express";
import { IGetLeaderBoardUseCase } from "../../../../Domain/Interface/Usecases/User/LeaderBoard/ILeaderBoard";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class LeaderBoardController {
  constructor(private readonly _getLeaderBoardUseCase: IGetLeaderBoardUseCase) {}

  getLeaderBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const response = await this._getLeaderBoardUseCase.execute(type);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}
