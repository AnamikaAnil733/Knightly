import {model} from "mongoose";
import {UserAchievementSchema,IUserAchievement} from "../Schema/UserAchievementsSchema";

export const UserAchievementModel = model<IUserAchievement>("UserAchievement",UserAchievementSchema);

