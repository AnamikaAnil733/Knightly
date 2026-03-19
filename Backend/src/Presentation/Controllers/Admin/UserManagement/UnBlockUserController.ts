import { Request, Response } from "express";
import { IUnBlockUserUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IUnBlockUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { BlockUserSchema } from "../../../Validators/AdminValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";

export class UnBlockUserController {
  constructor(private readonly _userUnBlockUseCase: IUnBlockUserUseCase) {}

  handleUserUnBan = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = BlockUserSchema.safeParse(req.params);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.USER_ID_REQUIRED,
        );
      }
      const { userId } = result.data;
      const response = await this._userUnBlockUseCase.unblockUser({ userId });
      res.status(HttpStatusCodes.OK).json(response);
    } catch (error: any) {
      console.error("BLOCK USER ERROR:", error);
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || MESSAGES.ERROR_UNBLOCKING_USER,
      });
    }
  };
}
