import { UserRole } from "./UserRole";

export type AccessTokenData = {
    userId: string;
    role:UserRole;
};

export type RefreshTokenData ={
    userId:string;
    role:UserRole;
};

export type GenerateRefreshTokenReturnType = {
    tokenId:string;
    refreshToken: string;
};