import AchievementEntity from "../../../../Entity/AchievementEntity";
import { CreateAchievementDTO } from "../../../../DTOs/AchievementsDTO";

export interface IAddAchievements{
    execute(achievement:CreateAchievementDTO):Promise<AchievementEntity>;
}