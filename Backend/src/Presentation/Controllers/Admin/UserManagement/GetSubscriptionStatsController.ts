import { Request, Response, NextFunction } from "express";
import { IGetSubscriptionStatsUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetSubscriptionStatsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class GetSubscriptionStatsController {
  constructor(private readonly _getSubscriptionStatsUseCase: IGetSubscriptionStatsUseCase) {}

  stats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const response = await this._getSubscriptionStatsUseCase.execute();
      return res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
