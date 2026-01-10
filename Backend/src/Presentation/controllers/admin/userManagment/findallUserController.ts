import { Request, Response, NextFunction } from "express";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/usecases/admin/IGetAllUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

export class GetAllUserController {
  constructor(
    private readonly getAllUserUseCase: IGetAllUserUseCase
  ) {}

  getallusers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.getAllUserUseCase.getAllUsers();
      return res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
