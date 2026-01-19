import { UserRole } from "../Types/UserRole";



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
        rating: number;
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
  

  export interface updateAvatarInputDto {
    userId: string;
    avatarKey: string;
  }
  
