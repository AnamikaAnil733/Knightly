import {model} from "mongoose";
import { AchievementSchema } from "../Schema/AchievementSchema";

export const AchievementModel = model("Achievements", AchievementSchema);