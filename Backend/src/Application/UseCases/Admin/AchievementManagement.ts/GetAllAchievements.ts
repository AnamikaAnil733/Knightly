import { IGetAllAchievements } from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IGetAllAchievements";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { AchievementResponseDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import {AchievementMapper} from "../../../Mapper/AchievementMapper";


export class GetAllAchievementsUseCase implements IGetAllAchievements{
    constructor(private readonly _achievementsRepository:IAchievementsRepository){}

    async execute(): Promise<AchievementResponseDTO[]> {
        const achievements = await this._achievementsRepository.findAll();
        return achievements.map((achievement) => AchievementMapper.toResponseDTO(achievement));
}
}