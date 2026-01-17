import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IGetAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IGetAvatarUseCase";
import { IUpdateAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IUpdateAvatarUseCase";


export class AvatarController{
    constructor(
        private readonly getAvatarUseCase:IGetAvatarUseCase,
        private readonly updateAvatarUseCase:IUpdateAvatarUseCase
    ){}

    getAvatarUrl = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId = (req as any).user.id
            const {contentType} = req.query

            const result = await this.getAvatarUseCase.execute({
                userId,
                contentType:String(contentType)
            })

            return res.status(HttpStatusCodes.OK).json(result)

        }catch(error){
          next(error)
        }
    }
    
    updateAvatar = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const userId = (req as any).user.id
            const { avatarUrl} =req.body

            await this.updateAvatarUseCase.execute({
                userId,
                avatarUrl
            })
            return res.status(HttpStatusCodes.OK).json({
                success:true,
                message:"Avatar updated sucessfully"
            })

        }catch(error){
            next(error)
        }
    }

}