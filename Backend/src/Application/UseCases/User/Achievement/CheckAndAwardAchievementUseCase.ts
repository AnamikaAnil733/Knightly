import { ICheckAndAwardAchievementUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/ICheckAndAwardAchievementUseCase";
import { IAchievementService } from "../../../../Domain/Interface/Service/IAchievementService";
import { CriteriaType } from "../../../../Domain/Types/AchievementsTypes";



export class CheckAndAwardAchievementUseCase implements ICheckAndAwardAchievementUseCase{
    constructor(
        private readonly _achievementService:IAchievementService
    ){}

    async execute(userId:string,type:CriteriaType,currentValue:number):Promise<string[]>{
        return this._achievementService.checkAchievements(userId,type,currentValue);
    }
}

