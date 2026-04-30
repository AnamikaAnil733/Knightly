import UserAchievementEntity from "../../Entity/UserAchievementEntity";
import { IBaseRepository } from "./IBaseRepository";


export interface IUserAchievementRepository extends IBaseRepository<UserAchievementEntity>{
    findUserAchievements(userId:string):Promise<UserAchievementEntity[]>;
    exists(userId:string,achievementId:string):Promise<boolean>;
}