import { UserRole } from "../../Domain/Types/UserRole";

export interface BaseUserResponseDTO{
    id: string;
    displayname: string;
    email: string;
    role: UserRole;
    isBlocked: boolean;
    isNewUser: boolean;
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

export interface GetAllUsersInputDto {
    page?: number;
    limit?: number;
  }
  

export interface GetAllUsersOutputDTO{
    users:BaseUserResponseDTO[];
    total:number;
}