import { IDeleteAchievementUseCase } from "../../../../Domain/Interface/Usecases/Admin/AchievementManagement/IDeleteAchievementsUseCase";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";


export class DeleteAchievementsUseCase implements IDeleteAchievementUseCase{
    constructor(
        private readonly _achievementRepository:IAchievementsRepository,
    ){}
    async execute(id: string): Promise<boolean> {
        if(!id){
            throw new Error("Achievement is not found with this id")
        }
        const deleted = await this._achievementRepository.delete(id);
         if(!deleted){
            throw new Error("Achievement  is not found");
         }
         return true

    }
}