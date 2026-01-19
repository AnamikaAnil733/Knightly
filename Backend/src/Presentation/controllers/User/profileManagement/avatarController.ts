import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IGetAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IGetAvatarUseCase";
import { IUpdateAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IUpdateAvatarUseCase";
import { ISaveDiceBearAvatarUseCase } 
from "../../../../Domain/Interface/usecases/user/ISaveDiceBearAvatarUseCase";


export class AvatarController{
    constructor(
        private readonly getAvatarUseCase:IGetAvatarUseCase,
        private readonly updateAvatarUseCase:IUpdateAvatarUseCase,
        private readonly saveDiceBearAvatarUseCase: ISaveDiceBearAvatarUseCase
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
    
    updateAvatar = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId = (req as any).user.id;
        const { avatarKey } = req.body;
    
        await this.updateAvatarUseCase.execute({
          userId,
          avatarKey,
        });
    
        return res.status(HttpStatusCodes.OK).json({
          success: true,
          message: "Avatar updated successfully",
        });
      } catch (error) {
        next(error);
      }
    };
    
    saveDiceBearAvatar = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const userId = (req as any).user.id;
          const { diceBearUrl } = req.body;
          console.log(diceBearUrl)
      
          const avatarUrl =
            await this.saveDiceBearAvatarUseCase.execute({
              userId,
              diceBearUrl,
            });
            console.log(avatarUrl)
      
          return res.status(HttpStatusCodes.OK).json({
            success: true,
            avatarUrl,
          });
        } catch (error) {
          next(error);
        }
      };
      

}