import { Request, Response } from "express";
import { IBlockUserUseCase } from "../../../../Domain/Interface/usecases/Admin/UserManagement/IBlockUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class BlockUserController {
  constructor(
    private readonly _userBlockUseCase: IBlockUserUseCase,
  ) {}

  handleUserBan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.USER_ID_REQUIRED ,
        });
        return;
      }
      const result = await this._userBlockUseCase.blockUser({ userId });
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || MESSAGES.ERROR_BLOCKING_USER,
      });
    }
  };
}
