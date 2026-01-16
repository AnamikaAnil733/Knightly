import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IEditProfileUseCase } from "../../../../Domain/Interface/usecases/user/IEditProfile";


export class EditProfileController{
  constructor(private editUserUsecase:IEditProfileUseCase) {}

  handleEditProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = (req as any).user.id;
      const { displayname } = req.body;
  
      const result = await this.editUserUsecase.editUser({
        userId,
        displayname,
      });

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Profile updated sucessfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
