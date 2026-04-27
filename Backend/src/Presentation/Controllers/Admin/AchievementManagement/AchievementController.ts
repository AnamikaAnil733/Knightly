import { Request, Response,NextFunction } from "express";
import {IAddAchievements} from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IAddAchievements";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CreateAchievementSchema } from "../../../Validators/AchievementsValidator";
import { AchievementMapper } from "../../../../Application/Mapper/AchievementMapper";



export class AchievementController {
    constructor(private readonly addAchievements:IAddAchievements){
       
    }

    public createAchievements = async(req:Request,res:Response,next:NextFunction)=>{
        try{
             const validateAchievement = CreateAchievementSchema.parse(req.body);
        const acheivement = await this.addAchievements.execute(validateAchievement);
        return res.status(HttpStatusCodes.CREATED).json({
            success: true,
            message: "Achievement created successfully",
            data: AchievementMapper.toResponseDTO(acheivement)
        })

        }catch(error){
           next(error)
        }
    }
}