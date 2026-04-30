import {IUserAchievement} from "../Database/Schema/UserAchievementsSchema";
import  UserAchievementEntity from "../../Domain/Entity/UserAchievementEntity";

export class MongoUserAchievementMapper{
    public toEntityFromDocument(model:IUserAchievement):UserAchievementEntity{
        return new UserAchievementEntity({
            id:model._id.toString(),
            userId:model.userId.toString(),
            achievementId:model.achievementId.toString(),
            unlockedAt:model.unlockedAt
        })
    }

    public toDocumentFromEntity(entity:UserAchievementEntity){
        return {
            userId:entity.userId,
            achievementId:entity.achievementId,
            unlockedAt:entity.unlockedAt
        }
    }
}