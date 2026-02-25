import { Request, Response } from "express";
import { IUnBlockUserUseCase } from "../../../../Domain/Interface/usecases/Admin/UserManagement/IUnBlockUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class UnBlockUserController {
  constructor(
    private readonly _userUnBlockUseCase: IUnBlockUserUseCase,
  ) {}

  handleUserUnBan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.USER_ID_REQUIRED,
        });
        return;
      }
      const result = await this._userUnBlockUseCase.unblockUser({ userId });
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error: any) {
      console.error("BLOCK USER ERROR:", error);
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || MESSAGES.ERROR_UNBLOCKING_USER,
      });
    }
  };
}
