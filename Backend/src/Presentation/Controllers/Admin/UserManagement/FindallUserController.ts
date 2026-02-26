import { Request, Response, NextFunction } from "express";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetAllUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

export class GetAllUserController {
  constructor(
    private readonly _getAllUserUseCase: IGetAllUserUseCase,
  ) {}

  getallusers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page)||1;
      const limit = Number(req.query.limit)||10;
      const search = (req.query.search)?.toString()|| "";
      const filter = (req.query.filter)?.toString()|| "";

      const result = await this._getAllUserUseCase.getAllUsers(
        page,
        limit,
        search,
        filter,
      );
      return res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
