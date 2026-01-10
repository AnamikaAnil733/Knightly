import {Schema } from "mongoose";
import { UserRole } from "../../../Domain/Types/UserRole";


export interface AuthSchemaType{
    displayname:string;
    email:string;
    passwordHash?:string;
    googleId?:string,
    role:UserRole;
    isBlocked:boolean;
    isNewUser:boolean;

    gamesPlayed: number;
    gamesWin: number;
    rating: number;
    premium: boolean;
    longestStreak: number;
    currentStreak: number;
    rewards: string[];
    achievements: string[];
    subscriptionStart?: Date;
    createdAt:Date
}

 export const authSchema = new Schema<AuthSchemaType>(
{
    displayname:{
        type:Schema.Types.String,
        required:true,
    },
    email:{
        type:Schema.Types.String,
        required:true,
    },
    passwordHash:{
        type:Schema.Types.String
    },
    googleId:{
        type:Schema.Types.String,
    },
    role:{
        type:Schema.Types.String,
        enum:Object.values(UserRole),
    },
    isBlocked:{
        type:Boolean,
        required:true,
        default:false,
    },
    isNewUser:{
        type:Boolean,
        required:true,
        default:true,
    },
    gamesPlayed: { type: Number, default: 0 },
    gamesWin: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    premium: { type: Boolean, default: false },
    longestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    rewards: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    subscriptionStart: { type: Date },

},
{timestamps:true}
)