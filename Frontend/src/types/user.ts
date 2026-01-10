export interface IUser{
    id: string;
    displayname: string;
    email: string;
    role: UserRole;
    isBlocked: boolean;
    isNewUser: boolean;
    createdAt: string;
    gamesPlayed: number;
    premium: boolean;
    rating: number;
    gamesWin: number;
    longestStreak: number;
    currentStreak: number;
    rewards: string[];
    achievements: string[];

}

export enum UserRole {
    "ADMIN" = "admin",
    "USER" = "user",
  }