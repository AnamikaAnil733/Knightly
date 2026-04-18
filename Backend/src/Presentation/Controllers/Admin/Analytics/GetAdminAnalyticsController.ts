import { Request, Response, NextFunction } from "express";
import { IGetAdminAnalyticsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Analytics/IGetAdminAnalyticsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class GetAdminAnalyticsController {
  constructor(private readonly _getAdminAnalyticsUseCase: IGetAdminAnalyticsUseCase) {}

  getAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const data = await this._getAdminAnalyticsUseCase.execute();
      return res.status(HttpStatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  };
}
