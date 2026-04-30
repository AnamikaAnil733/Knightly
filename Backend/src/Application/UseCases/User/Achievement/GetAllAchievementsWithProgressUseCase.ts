import { IGetAllAchievementsWithProgressUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/IGetAllAchievementsWithProgressUseCase";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { IUserAchievementRepository } from "../../../../Domain/Interface/Repositories/IUserAchievementRepository";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";
import { AchievementProgressDTO } from "../../../../Domain/DTOs/AchievementsDTO";

export class GetAllAchievementsWithProgressUseCase implements IGetAllAchievementsWithProgressUseCase {
    constructor(
        private readonly _achievementRepo: IAchievementsRepository,
        private readonly _userAchievementRepo: IUserAchievementRepository
    ) {}

    async execute(userId: string): Promise<AchievementProgressDTO[]> {
        const allAchievements = await this._achievementRepo.findAll();
        const earnedRecords = await this._userAchievementRepo.findUserAchievements(userId);
        
        const earnedMap = new Map(earnedRecords.map(r => [r.achievementId, r.unlockedAt]));

        return allAchievements.map(ach => {
            const unlockedAt = earnedMap.get(ach.id!);
            
            return {
                ...AchievementMapper.toResponseDTO(ach),
                isEarned: !!unlockedAt,
                earnedAt: unlockedAt
            };
        });
    }
}
