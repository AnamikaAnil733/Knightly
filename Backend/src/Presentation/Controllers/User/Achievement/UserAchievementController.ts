import {Request,Response,NextFunction} from "express";
import {IGetEarnedAchievementsUseCase} from "../../../../Domain/Interface/Usecases/User/AchievementManagement/IGetEarnedAchievementsUseCase";
import { ICheckAndAwardAchievementUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/ICheckAndAwardAchievementUseCase";
import { IGetAllAchievementsWithProgressUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/IGetAllAchievementsWithProgressUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";



export class UserAchievementController {
    constructor(
        private readonly _getEarnedAchievements:IGetEarnedAchievementsUseCase,
        private readonly _checkAndAwardAchievement:ICheckAndAwardAchievementUseCase,
        private readonly _getAllAchievementsWithProgress: IGetAllAchievementsWithProgressUseCase
    ){}

    public getAllAchievements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Unauthorized"
                })
            }
            const achievements = await this._getAllAchievementsWithProgress.execute(userId);

            return res.status(HttpStatusCodes.OK).json({
                success: true,
                message: "All achievements with progress fetched successfully",
                data: achievements
            })
        } catch (error) {
            next(error)
        }
    }

    public getEarnedAchievements=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const userId=(req as any).user?.id;
            if(!userId){
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    success:false,
                    message:"Unauthorized"
                })
            }
            const achievements = await this._getEarnedAchievements.execute(userId);

            return res.status(HttpStatusCodes.OK).json({
                success:true,
                message:"Achievements fetched successfully",
                data:achievements
            })
        }catch(error){
            next(error)
        }
    }

public checkProgress = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const userId=(req as any).user?.id;
        const {type,currentValue}=req.body;
        const newBadges = await this._checkAndAwardAchievement.execute(userId,type,currentValue);
        return res.status(HttpStatusCodes.OK).json({
            success:true,
            message:newBadges.length > 0 ?`Congratulation! You earned ${newBadges.join(',')}`:"No new achievements",
            data:newBadges
        })
    }catch(error){
        next(error)
    }
    
}

    }