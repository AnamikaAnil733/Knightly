import AchievementEntity from "../../Entity/AchievementEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IAchievementsRepository extends IBaseRepository<AchievementEntity> {
    findAll(): Promise<AchievementEntity[]>;
}