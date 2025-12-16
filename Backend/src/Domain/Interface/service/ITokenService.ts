import {
    AccessTokenData,
    GenerateRefreshTokenReturnType,
    RefreshTokenData
  } from "../../../Domain/Types/tokentypes";
  
  export interface ITokenService {
    generateAccessToken(data: AccessTokenData): string;
    verifyAccessToken(token: string): AccessTokenData;
  
    generateRefreshToken(
      data: RefreshTokenData
    ): GenerateRefreshTokenReturnType;
  
    verifyRefreshToken(token: string): RefreshTokenData;
  }
  