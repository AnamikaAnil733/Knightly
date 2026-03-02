import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IChangePasswordUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IChangePassword";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";




export class ChangePassswordController{
  constructor( private _changePasswordUsecase:IChangePasswordUseCase){}

  handleChangePassword = async (req:Request,res:Response,next:NextFunction)=>{
    try{
      const userId = (req as any).user.id;
      const {currentPassword,newPassword} = req.body;

      await this._changePasswordUsecase.changePassword({
        userId,
        currentPassword,
        newPassword,
      });

      return res.status(HttpStatusCodes.OK).json({
        success:true,
        message:MESSAGES.PASSWORD_UPDATE_SUCCESS,
      });

    }catch(error){
      next(error);
    }
  };

}
