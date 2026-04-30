import { CriteriaType } from "../../../../Types/AchievementsTypes";


export interface ICheckAndAwardAchievementUseCase{
    execute(userId:string,type:CriteriaType,currentValue:number):Promise<string[]>;
}