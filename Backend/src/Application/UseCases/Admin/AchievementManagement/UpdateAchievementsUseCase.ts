import {IUpdateAchievementUseCase} from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IUpdateAchievements";
import { UpdateAchievementDTO,AchievementResponseDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import AchievementEntity from "../../../../Domain/Entity/AchievementEntity";


export class UpdateAchievementUseCase implements IUpdateAchievementUseCase{
    constructor(
     private   readonly  _achievementsRepository:IAchievementsRepository,
    ){}
   async execute(dto: UpdateAchievementDTO): Promise<AchievementResponseDTO> {
    const existing = await this._achievementsRepository.findById(dto.id);
    if (!existing) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, "Achievement not found");
    }

    const mergedEntity = new AchievementEntity({
        id: dto.id,
        title: dto.title ?? existing.title,
        description: dto.description ?? existing.description,
        icon: dto.icon ?? existing.icon,
        criteriaType: dto.criteriaType ?? existing.criteriaType,
        criteriaValue: dto.criteriaValue ?? existing.criteriaValue,
        createdAt: existing.createdAt
    });

    const updated = await this._achievementsRepository.update(mergedEntity);
    if (!updated) {
        throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update achievement");
    }
    return AchievementMapper.toResponseDTO(updated);
}
}