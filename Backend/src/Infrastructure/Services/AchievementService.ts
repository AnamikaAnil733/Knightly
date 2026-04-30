import { IAchievementService } from "../../Domain/Interface/Service/IAchievementService";
import { CriteriaType } from "../../Domain/Types/AchievementsTypes";
import { IAchievementsRepository } from "../../Domain/Interface/Repositories/IAchievementsRepository";
import { IUserAchievementRepository } from "../../Domain/Interface/Repositories/IUserAchievementRepository";
import  UserAchievementEntity from "../../Domain/Entity/UserAchievementEntity";



export class AchievementService implements IAchievementService{
    constructor(
        private readonly _achievementsRepository: IAchievementsRepository,
        private readonly _userAchievementRepository: IUserAchievementRepository
    ){}

    async checkAchievements(userId: string, type: CriteriaType, currentValue: number): Promise<string[]> {
        const allAchievements = await this._achievementsRepository.findAll();
        const eligible = allAchievements.filter(ach=>
        ach.criteriaType===type && ach.criteriaValue<=currentValue
        );
        const earnedNewAchievements:string[] = [];
        for(const ach of eligible){
            const exists = await this._userAchievementRepository.exists(userId,ach.id!);
            if(!exists){
                const entity = new UserAchievementEntity({
                    userId,
                    achievementId:ach.id!
                });
                await this._userAchievementRepository.create(entity);
                earnedNewAchievements.push(ach.title);
            }
        }
        return earnedNewAchievements;
    }
}

