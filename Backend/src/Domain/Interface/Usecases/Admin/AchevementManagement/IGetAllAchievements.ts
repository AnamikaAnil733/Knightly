import { AchievementResponseDTO } from "../../../../DTOs/AchievementsDTO";

export interface IGetAllAchievements{
    execute():Promise<AchievementResponseDTO[]>;
}
