import { UserRole } from "../../Domain/Types/UserRole";

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
    rating: number;
    gamesPlayed: number;
    gamesWin: number;
    longestStreak: number;
    currentStreak: number;
    rewards: string[];
    achievements: string[];
    premium: boolean;
    
}