import { Request,Response,NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IGetAvatarUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IGetAvatarUseCase";
import { IGetUserProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IGetUserProfileUseCase";
import { ISaveDiceBearAvatarUseCase }
  from "../../../../Domain/Interface/Usecases/User/ProfileManagement/ISaveDiceBearAvatarUseCase";


export class AvatarController{
  constructor(
        private readonly _getAvatarUseCase:IGetAvatarUseCase,
        private readonly _getUserProfileUseCase:IGetUserProfileUseCase,
        private readonly _saveDiceBearAvatarUseCase: ISaveDiceBearAvatarUseCase,
  ){}

  getAvatarUrl = async(req:Request,res:Response,next:NextFunction)=>{
    try{
      const userId = (req as any).user.id;
      const {contentType} = req.query;

      const result = await this._getAvatarUseCase.execute({
        userId,
        contentType:String(contentType),
      });

      return res.status(HttpStatusCodes.OK).json(result);

    }catch(error){
      next(error);
    }
  };



  saveDiceBearAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = (req as any).user.id;
      const { diceBearUrl } = req.body;

      const avatarUrl =
            await this._saveDiceBearAvatarUseCase.execute({
              userId,
              diceBearUrl,
            });

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  };


  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = (req as any).user.id;

      const profile = await this._getUserProfileUseCase.execute(userId);

      return res.status(HttpStatusCodes.OK).json(profile);
    } catch (error) {
      next(error);
    }
  };


}
