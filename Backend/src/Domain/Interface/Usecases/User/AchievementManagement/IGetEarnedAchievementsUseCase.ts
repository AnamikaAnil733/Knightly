import {AchievementResponseDTO} from "../../../../DTOs/AchievementsDTO";

export interface IGetEarnedAchievementsUseCase{
    execute(userId:string):Promise<AchievementResponseDTO[]>;
}