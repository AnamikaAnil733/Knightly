import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IEditProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IEditProfile";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { UpdateProfileSchema } from "../../../Validators/UserValidator";
import { CustomError } from "../../../../Domain/Entity/CustomError";

export class EditProfileController {
  constructor(private _editUserUsecase: IEditProfileUseCase) {}

  handleEditProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = UpdateProfileSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }
      const userId = (req as any).user.id;
      const { displayname } = result.data;
      console.log(displayname);

      const response = await this._editUserUsecase.editUser({
        userId,
        displayname,
      });

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.PROFILE_UPDATE_SUCCESS,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}
