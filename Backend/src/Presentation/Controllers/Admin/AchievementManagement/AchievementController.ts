import { Request, Response,NextFunction } from "express";
import { Types } from "mongoose";
import {IAddAchievementsUseCase} from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IAddAchievementsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CreateAchievementSchema ,UpdateAchievementSchema} from "../../../Validators/AchievementsValidator";
import { AchievementMapper } from "../../../../Application/Mapper/AchievementMapper";
import { IGetAllAchievementsUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IGetAllAchievementsUseCase";
import { IUpdateAchievementUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IUpdateAchievements";
import { IDeleteAchievementUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IDeleteAchievementsUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../../Domain/Entity/CustomError";


export class AchievementController {
    constructor(private readonly _addAchievements:IAddAchievementsUseCase,
          private readonly _getAllAchievements:IGetAllAchievementsUseCase,
          private readonly _updateAchievements:IUpdateAchievementUseCase,
          private readonly _deleteAchievement:IDeleteAchievementUseCase,
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

    public updateAchievement = async(req:Request,res:Response,next:NextFunction)=>{
        try{

            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Invalid achievement ID");
            }
            const validateAchievement = UpdateAchievementSchema.parse({ id: req.params.id ,...req.body});
            const acheivement = await this._updateAchievements.execute(validateAchievement)
            return res.status(HttpStatusCodes.ACCEPTED).json({
                success: true,
                message: "Achievement updated successfully",
                data: acheivement
            })

        }catch(error){
       next(error)
        }
    }

    public deleteAchievement = async(req:Request,res:Response,next:NextFunction)=>{
        try{
            const {id} = req.params;
            if (!Types.ObjectId.isValid(id)) {
                throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Invalid achievement ID");
            }
            await this._deleteAchievement.execute(id);
            return res.status(HttpStatusCodes.OK).json({
                success:true,
                message:MESSAGES.ACHIEVEMENT_DELETE_SUCCESS,
            })

        }catch(error){
         next(error)
        }
    }
}