import { UserRole } from "../Types/UserRole";
import { TimeControl } from "../Entity/RatingEntity";

export interface AuthRequestDTO{
    displayname?:string;
    email:string;
    role?:UserRole;
    password?:string;
}

export interface AuthResponseDTO{
    id:string;
    displayname:string;
    email:string;
    role:UserRole;
    isNewUser:boolean;
    accessToken:string;
    rating: {
        BULLET: number;
        BLITZ: number;
        RAPID: number;
        CLASSICAL: number;
      };
    gamesPlayed: number;
    gamesWin: number;
    longestStreak: number;
    currentStreak: number;
    rewards: string[];
    achievements: string[];
    premium: boolean;
    avatarUrl:string;
    subscriptionStart?: Date;
}
