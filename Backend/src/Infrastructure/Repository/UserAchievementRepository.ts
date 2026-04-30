import {BaseRepository} from "./BaseRepository";
import UserAchievementEntity from "../../Domain/Entity/UserAchievementEntity";
import { IUserAchievementRepository } from "../../Domain/Interface/Repositories/IUserAchievementRepository";
import { UserAchievementModel } from "../Database/Model/UserAchievementModel";
import { MongoUserAchievementMapper } from "../Mapper/MongoUserAchievementMapper";
import { IUserAchievement } from "../Database/Schema/UserAchievementsSchema";

export class UserAchievementRepository extends BaseRepository<UserAchievementEntity,IUserAchievement> implements IUserAchievementRepository{
    constructor(){
        super(UserAchievementModel,new MongoUserAchievementMapper());
    }
    
    async findUserAchievements(userId:string):Promise<UserAchievementEntity[]>{
        const documents = await UserAchievementModel.find({userId}).sort({unlockedAt:-1})
        return documents.map(doc=>this.mapper.toEntityFromDocument(doc));
    
    }

    async exists(userId:string,achievementId:string):Promise<boolean>{
        const document = await UserAchievementModel.exists({userId,achievementId})
        return !!document;
}
}
