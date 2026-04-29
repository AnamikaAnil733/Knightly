import {IUpdateAchievementUseCase} from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IUpdateAchievements";
import { UpdateAchievementDTO,AchievementResponseDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { CustomError } from "../../../../Domain/Entity/CustomError";


export class UpdateAchievementUseCase implements IUpdateAchievementUseCase{
    constructor(
     private   readonly  _achievementsRepository:IAchievementsRepository,
    ){}
   async execute(achievement: UpdateAchievementDTO): Promise<AchievementResponseDTO> {
    const updated= await this._achievementsRepository.update(AchievementMapper.toEntityForUpdate(achievement))
        if (!updated) {
            throw new CustomError(HttpStatusCodes.NOT_FOUND, "Achievement not found");
        }
    return AchievementMapper.toResponseDTO(updated)
    }
}