import { PuzzleType } from "../Types/PuzzleTypes";
import { UserRole } from "../Types/UserRole";

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

//--------get all users DTOs------

export interface GetAllUsersInputDto {
    page?: number;
    limit?: number;
  }


export interface GetAllUsersOutputDTO{
    users:BaseUserResponseDTO[];
    total:number;
    page:number;
    totalPages:number;
}

//-------userManangement DTOs-------

//----block DTOs-----

export interface BlockUserInputDTO{
    userId:string;
}

export interface BlockUserOutputDTO{
   success:Boolean;
   message:string;
}
//---unblock DTOs----


export interface UnBlockUserInputDTO{
    userId:string;
}

export interface UnBlockUserOutputDTO{
   success:Boolean;
   message:string;
}


//------PuzzleManagement----

export interface CreatePuzzleInputDTO{
    fen:string;
    difficulty:PuzzleType;
    moves:string[];
}

export interface UpdatePuzzleInputDTO{
    fen?:string;
    difficulty?:PuzzleType;
    moves?:string[];
    isActive?:boolean;
}

export interface PuzzleResponseDTO{
    id: string;
    fen: string;
    difficulty: PuzzleType;
    moves: string[];
    solutionLength: number;
    isActive: boolean;
    createdAt: string;
}

export interface GetAllPuzzleOutputDTO{
    puzzles: PuzzleResponseDTO[];
    total: number;
    page: number;
    totalPages: number;
}
export interface GetallPuzzleInputDTO{
    page?: number;
    limit?: number;
    difficulty?: PuzzleType;

}


