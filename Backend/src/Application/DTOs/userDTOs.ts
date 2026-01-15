import { UserRole } from "../../Domain/Types/UserRole";


export interface EditProfileinputDto{
    userId:string;
    displayname:string
}


export interface EditProfileoutputDto{
       id: string|undefined;
       displayname: string;
        email: string;
        role: UserRole;
        isBlocked: boolean;
        createdAt?: Date;
        gamesPlayed: number;
        premium: boolean;
        rating: number;
        gamesWin: number;
        longestStreak: number;
        currentStreak: number;
        rewards: string[];
        achievements: string[];
}
