import {UpdateAchievementDTO,AchievementResponseDTO } from "../../../../DTOs/AchievementsDTO";

export interface IUpdateAchievementUseCase{
    execute(input:UpdateAchievementDTO):Promise<AchievementResponseDTO>;
}
