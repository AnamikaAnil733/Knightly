import { CriteriaType } from "../../Types/AchievementsTypes";



export interface IAchievementService {
    checkAchievements(userId: string, type: CriteriaType,currentValue:number):Promise<string[]>;
}