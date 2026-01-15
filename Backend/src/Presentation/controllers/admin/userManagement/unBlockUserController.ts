import { Request, Response } from "express";
import { IUnBlockUserUseCase } from "../../../../Domain/Interface/usecases/admin/IUnBlockUserUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

export class UnBlockUserController {
  constructor(
    private readonly userUnBlockUseCase: IUnBlockUserUseCase,
  ) {}

  handleUserUnBan = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: "User ID is required",
        });
        return;
      }
      const result = await this.userUnBlockUseCase.unblockUser({ userId });
      res.status(HttpStatusCodes.OK).json(result);
    } catch (error: any) {
      console.error("BLOCK USER ERROR:", error);
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || "Error while unblocking the user",
      });
    }
  };
}
