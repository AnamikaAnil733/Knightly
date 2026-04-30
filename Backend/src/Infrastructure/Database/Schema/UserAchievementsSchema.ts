import {Schema,Document,model,Types} from "mongoose";

export interface IUserAchievement extends Document{
    userId:Types.ObjectId;
    achievementId:Types.ObjectId;
    unlockedAt:Date;
}

export const UserAchievementSchema = new Schema<IUserAchievement>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'Auth',
        required:true,
    },
    achievementId:{
        type:Schema.Types.ObjectId,
        ref:'Achievements',
        required:true,
    },
    unlockedAt:{
        type:Date,
        default:Date.now
    }
})

 UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

