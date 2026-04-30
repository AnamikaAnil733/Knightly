import { IGetEarnedAchievementsUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/IGetEarnedAchievementsUseCase";
import { AchievementResponseDTO } from "../../../../Domain/DTOs/AchievementsDTO";
import { IAchievementsRepository } from "../../../../Domain/Interface/Repositories/IAchievementsRepository";
import { IUserAchievementRepository } from "../../../../Domain/Interface/Repositories/IUserAchievementRepository";
import { AchievementMapper } from "../../../Mapper/AchievementMapper";


export class GetEarnedAchievementsUseCase implements IGetEarnedAchievementsUseCase{
    constructor(
        private readonly _userAchievementRepository:IUserAchievementRepository,
        private readonly _achievementsRepository:IAchievementsRepository,
    ){}

    async execute(userId:string):Promise<AchievementResponseDTO[]>{
        const userAchievements = await this._userAchievementRepository.findUserAchievements(userId);
        const detailedAchievements:AchievementResponseDTO[]=[]

        for(const record of userAchievements){
            const details = await this._achievementsRepository.findById(record.achievementId);
            if(details){
                detailedAchievements.push(AchievementMapper.toResponseDTO(details))
        }
        
    }
    return detailedAchievements;
}
}

