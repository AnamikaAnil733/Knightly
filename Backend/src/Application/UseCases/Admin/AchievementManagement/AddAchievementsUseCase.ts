import { IAddAchievementsUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IAddAchievementsUseCase";
import AchievementEntity from "../../../../Domain/Entity/AchievementEntity";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { CreateAchievementDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";

export class AddAchievementsUseCase implements IAddAchievementsUseCase {
    constructor(private readonly _achievementsRepository: IAchievementsRepository) { }
    async execute(achievement: CreateAchievementDTO): Promise<AchievementEntity> {
        return await this._achievementsRepository.create(AchievementMapper.toEntity(achievement));
    }
}
