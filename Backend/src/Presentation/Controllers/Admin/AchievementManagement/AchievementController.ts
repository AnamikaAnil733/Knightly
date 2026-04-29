import { Request, Response,NextFunction } from "express";
import {IAddAchievements} from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IAddAchievements";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CreateAchievementSchema } from "../../../Validators/AchievementsValidator";
import { AchievementMapper } from "../../../../Application/Mapper/AchievementMapper";
import { IGetAllAchievements } from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IGetAllAchievements";



export class AchievementController {
    constructor(private readonly _addAchievements:IAddAchievements,
          private readonly _getAllAchievements:IGetAllAchievements,
    ){
       
    }

    public createAchievements = async(req:Request,res:Response,next:NextFunction)=>{
        try{
             const validateAchievement = CreateAchievementSchema.parse(req.body);
        const acheivement = await this._addAchievements.execute(validateAchievement);
        return res.status(HttpStatusCodes.CREATED).json({
            success: true,
            message: "Achievement created successfully",
            data: AchievementMapper.toResponseDTO(acheivement)
        })

        }catch(error){
           next(error)
        }
    }

    public getAllAchievements = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const achievements = await this._getAllAchievements.execute();
            return res.status(HttpStatusCodes.OK).json({
                success: true,
                message: "Achievements fetched successfully",
                data: achievements
            })
        }
        catch(error){
         next(error)
        }
    }
}