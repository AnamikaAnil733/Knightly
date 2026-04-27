import { BaseRepository } from "./BaseRepository";
import { AchievementModel } from "../Database/Model/AchievementsModel";
import { AchievementDocument } from "../Database/Schema/AchievementSchema";
import AchievementEntity from "../../Domain/Entity/AchievementEntity";
import { MongoAchievementMapper } from "../Mapper/MongoAchievementMapper";

export class AchievementsRepository extends BaseRepository<AchievementEntity,AchievementDocument>{
    constructor(){
        super(AchievementModel,new MongoAchievementMapper());
    }
}

    
