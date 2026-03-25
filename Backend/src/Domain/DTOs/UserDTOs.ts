import { UserRole } from "../Types/UserRole";
import { PieceType } from "../Chess/Types/PieceType";
import { PuzzleType } from "../Types/PuzzleTypes";



//------------Edit-Profile-------------

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
        rating: {
          BULLET: number;
          BLITZ: number;
          RAPID: number;
          CLASSICAL: number;
        }
        gamesWin: number;
        longestStreak: number;
        currentStreak: number;
        rewards: string[];
        achievements: string[];
}


//---------Change-password------------

export interface ChangePasswordInputDto{
    userId:string;
    currentPassword:string;
    newPassword:string;
}


export type ChangePasswordOutputDto = void


//----------Avatar-------------

export interface GetAvatarInputDto{
    userId:string;
    contentType:string;
}

export interface GetAvatarOutputDto {
    uploadUrl: string;
    key: string;
  }


export interface GetUserProfileOutputDto {
    id: string;

    displayname: string;
    email: string;

    role: UserRole;
    isBlocked: boolean;

    createdAt: string;

    gamesPlayed: number;
    gamesWin: number;
    rating: {
      BULLET: number;
      BLITZ: number;
      RAPID: number;
      CLASSICAL: number;
    }
    premium: boolean;

    longestStreak: number;
    currentStreak: number;

    rewards: string[];
    achievements: string[];

    avatarUrl: string | null;
  }


//---------GameDTO---------

export interface SerializedPieceDTO {
    type: "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING"
    color: "WHITE" | "BLACK"
    hasMoved: boolean
  }

export type BoardDTO = (SerializedPieceDTO | null)[][];


export interface MoveDTO {
    from: { row: number; col: number }
    to: { row: number; col: number }
    piece: string
    color: "WHITE" | "BLACK"
  }


export interface GameOutputDTO{
    gameId:string,
    turn:"WHITE"|"BLACK",
    board:BoardDTO,
    history:MoveDTO[],
    status:string,
    clock: {
      whiteTime: number;
      blackTime: number;
      increment: number;
      turn: "WHITE" | "BLACK";
    };
    whitePlayer?: {
        name: string;
        rating: number;
        avatar: string | null;
    };
    blackPlayer?: {
        name: string;
        rating: number;
        avatar: string | null;
    };
    timeControl: string;
    modeName: string;
  }


//-----PuzzleDTO-----
export interface UserPuzzleResponseDTO {
    id: string;
    fen: string;
    difficulty: PuzzleType;
  }


//------LeaderBoardDTO-----
export interface LeaderBoardResponse {
  rank: number;
  displayname: string;
  avatarKey: string;
  rating: number;
}


//------FriendManagementDTOs-----

export interface FriendDTO {
  id: string;
  displayname: string;
  email: string;
  avatarUrl: string | null;
}

export interface PendingRequestDTO {
  id: string;
  displayname: string;
  avatarUrl: string | null;
  requestedAt: Date;
}

export interface SearchUserDTO {
  id: string;
  displayname: string;
  avatarUrl: string | null;
}
