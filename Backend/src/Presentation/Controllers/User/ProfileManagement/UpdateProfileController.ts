import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IEditProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IEditProfile";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class EditProfileController {
  constructor(private _editUserUsecase: IEditProfileUseCase) {}

  handleEditProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user.id;
      const { displayname } = req.body;
      console.log(displayname);

      const result = await this._editUserUsecase.editUser({
        userId,
        displayname,
      });

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.PROFILE_UPDATE_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
