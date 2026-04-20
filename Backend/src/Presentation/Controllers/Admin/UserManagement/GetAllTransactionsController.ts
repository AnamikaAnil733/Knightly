import { Request, Response, NextFunction } from "express";
import IGetAllTransactionsUseCase from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetAllTransactionsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class GetAllTransactionsController {
  constructor(private readonly _getAllTransactionsUseCase: IGetAllTransactionsUseCase) {}

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { transactions, total } = await this._getAllTransactionsUseCase.execute(page, limit);

      return res.status(HttpStatusCodes.OK).json({
        transactions,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      next(error);
    }
  };
}
