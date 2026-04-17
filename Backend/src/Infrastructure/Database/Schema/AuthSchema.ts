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
    rating: {
      BULLET: number;
      BLITZ: number;
      RAPID: number;
      CLASSICAL: number;
    };
    ratingHistory: {
      rating: number;
      date: Date;
      type: string;
    }[];
    premium: boolean;
    longestStreak: number;
    currentStreak: number;
    rewards: string[];
    achievements: string[];
    subscriptionStart?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    createdAt:Date;
    avatarKey:string;
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
      type:Schema.Types.String,
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
    rating: {
      type: {
        BULLET: { type: Number, default: 300 },
        BLITZ: { type: Number, default: 300 },
        RAPID: { type: Number, default: 300 },
        CLASSICAL: { type: Number, default: 300 },
      },
      default: { BULLET: 300, BLITZ: 300, RAPID: 300, CLASSICAL: 300 },
      _id: false,
    },
    ratingHistory: {
      type: [
        {
          rating: { type: Number, required: true },
          date: { type: Date, required: true, default: Date.now },
          type: { type: String, required: true },
        },
      ],
      default: [],
      _id: false,
    },
    premium: { type: Boolean, default: false },
    longestStreak: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    rewards: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    subscriptionStart: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    avatarKey: { type: String,default:null },

  },
  {timestamps:true},
);
