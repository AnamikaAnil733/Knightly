import {AchievementDocument} from "../Database/Schema/AchievementSchema";
import AchievementEntity from "../../Domain/Entity/AchievementEntity";

export class MongoAchievementMapper{
    public toEntityFromDocument(document:AchievementDocument):AchievementEntity{
        return new AchievementEntity({
            id: document._id.toString(),
            title: document.title,
            description: document.description,
            icon: document.icon,
            criteriaType: document.criteriaType as any,
            criteriaValue: document.criteriaValue,
            createdAt: document.createdAt,
        });
    }
    public toDocumentFromEntity(entity:AchievementEntity){
        return {
            title: entity.title,
            description: entity.description,
            icon: entity.icon,
            criteriaType: entity.criteriaType as any,
            criteriaValue: entity.criteriaValue,
            createdAt: entity.createdAt,
        };
    }
}