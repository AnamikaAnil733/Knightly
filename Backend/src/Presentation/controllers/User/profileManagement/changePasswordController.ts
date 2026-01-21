import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IChangePasswordUseCase } from "../../../../Domain/Interface/usecases/user/IChangePassword";




export class ChangePassswordController{
    constructor( private _changePasswordUsecase:IChangePasswordUseCase){}

    handleChangePassword = async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId = (req as any).user.id;
            const {currentPassword,newPassword} = req.body;

            await this._changePasswordUsecase.changePassword({
                userId,
                currentPassword,
                newPassword
            });

            return res.status(HttpStatusCodes.OK).json({
                success:true,
                message:"Password Updated sucessfully"
            })

        }catch(error){
             next(error)
        }
    }

}