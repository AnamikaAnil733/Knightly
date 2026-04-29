import { IGetAllAchievementsUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchevementManagement/IGetAllAchievementsUseCase";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { AchievementResponseDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import {AchievementMapper} from "../../../Mapper/AchievementMapper";


export class GetAllAchievementsUseCase implements IGetAllAchievementsUseCase{
    constructor(private readonly _achievementsRepository:IAchievementsRepository){}

    async execute(): Promise<AchievementResponseDTO[]> {
        const achievements = await this._achievementsRepository.findAll();
        return achievements.map((achievement) => AchievementMapper.toResponseDTO(achievement));
}
}