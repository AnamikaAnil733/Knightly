import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IEditProfileUseCase } from "../../../../Domain/Interface/usecases/user/IEditProfile";


export class EditProfileController{
    constructor(private editUserUsecase:IEditProfileUseCase) {}

    async handleEditProfile(req:Request,res:Response,next:NextFunction){
        try{
            const userId = req.body;
            const { displayname } = req.body;
           let result = await this.editUserUsecase.editUser({userId,displayname})
            res.status(HttpStatusCodes.OK).json({
                success:true,
                message : "profile updated sucessfully",
                data:result
            });
        }catch(error){
          next(error)
        }
    }
}
