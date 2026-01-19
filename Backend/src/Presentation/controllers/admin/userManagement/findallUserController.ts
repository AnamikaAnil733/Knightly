import { Request, Response, NextFunction } from "express";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/usecases/admin/IGetAllUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

export class GetAllUserController {
  constructor(
    private readonly getAllUserUseCase: IGetAllUserUseCase,
  ) {}

  getallusers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page)||1;
      const limit = Number(req.query.limit)||10;

      const result = await this.getAllUserUseCase.getAllUsers(
        page,
        limit
      );
      return res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
