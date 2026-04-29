import { IDeleteAchievementUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IDeleteAchievementsUseCase";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";


export class DeleteAchievementUseCase implements IDeleteAchievementUseCase{
    constructor(
        private readonly _achievementRepository:IAchievementsRepository,
    ){}
    async execute(id: string): Promise<boolean> {
        if(!id){
            throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Achievement ID is required")
        }
        const deleted = await this._achievementRepository.delete(id);
         if(!deleted){
            throw new CustomError(HttpStatusCodes.NOT_FOUND, "Achievement not found");
         }
         return true

    }
}