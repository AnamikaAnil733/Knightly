import { Request, Response } from "express";
import { IBlockUserUseCase } from "../../../../Domain/Interface/usecases/admin/IBlockUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

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
          message: "User ID is required",
        });
        return;
      }
      const result = await this._userBlockUseCase.blockUser({ userId });
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error: any) {
      console.error("BLOCK USER ERROR:", error);
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Error while blocking the user",
      });
    }
  };
}
