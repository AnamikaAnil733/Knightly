import { AchievementResponseDTO } from "../../../../DTOs/AchievementsDTO";

export interface IGetAllAchievementsUseCase{
    execute():Promise<AchievementResponseDTO[]>;
}
