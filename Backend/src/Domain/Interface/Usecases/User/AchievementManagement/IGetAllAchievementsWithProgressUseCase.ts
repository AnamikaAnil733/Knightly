import { AchievementProgressDTO } from "../../../../DTOs/AchievementsDTO";



export interface IGetAllAchievementsWithProgressUseCase {
    execute(userId: string): Promise<AchievementProgressDTO[]>;
}
