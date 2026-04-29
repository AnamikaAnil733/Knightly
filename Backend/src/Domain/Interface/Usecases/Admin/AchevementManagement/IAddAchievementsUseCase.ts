import AchievementEntity from "../../../../Entity/AchievementEntity";
import { CreateAchievementDTO } from "../../../../DTOs/AchievementsDTO";

export interface IAddAchievementsUseCase{
    execute(achievement:CreateAchievementDTO):Promise<AchievementEntity>;
}