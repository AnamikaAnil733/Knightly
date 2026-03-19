import { Request, Response, NextFunction } from "express";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetAllUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { GetAllUsersSchema } from "../../../Validators/AdminValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class GetAllUserController {
  constructor(private readonly _getAllUserUseCase: IGetAllUserUseCase) {}

  getallusers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const result = GetAllUsersSchema.safeParse(req.query);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }
      const { page, limit, search, filter } = result.data;

      const response = await this._getAllUserUseCase.getAllUsers(
        page,
        limit,
        search,
        filter,
      );
      return res.status(HttpStatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
