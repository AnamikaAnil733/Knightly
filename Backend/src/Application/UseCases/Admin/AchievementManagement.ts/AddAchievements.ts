import { IAddAchievements } from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IAddAchievements";
import AchievementEntity from "../../../../Domain/Entity/AchievementEntity";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { CreateAchievementDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";

export class AddAchievementsUseCase implements IAddAchievements {
    constructor(private readonly achievementsRepository: IAchievementsRepository) { }
    async execute(achievement: CreateAchievementDTO): Promise<AchievementEntity> {
        return await this.achievementsRepository.create(AchievementMapper.toEntity(achievement));
    }
}
