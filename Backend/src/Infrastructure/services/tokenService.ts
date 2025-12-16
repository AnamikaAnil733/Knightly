import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { AccessTokenData, GenerateRefreshTokenReturnType, RefreshTokenData } from "../../Domain/Types/tokentypes";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class TokenService implements ITokenService {
    private readonly _accessTokenSecret: string;
    private readonly _refreshTokenSecret: string;

    constructor() {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("Access token secret not found");
        }
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("Refresh token secret not found");
        }

        this._accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    }

    generateAccessToken(data: AccessTokenData): string {
        return jwt.sign(data, this._accessTokenSecret, { expiresIn: "5m" });
    }

    verifyAccessToken(token: string): AccessTokenData {
        try {
            return jwt.verify(token, this._accessTokenSecret) as AccessTokenData;
        } catch (err) {
            throw new Error("Invalid or expired access token");
        }
    }

    generateRefreshToken(data: RefreshTokenData): GenerateRefreshTokenReturnType {
        const tokenId = uuidv4();
        const refreshToken = jwt.sign({ ...data, tokenId }, this._refreshTokenSecret, { expiresIn: "7d" });
        return { tokenId, refreshToken };
    }

    verifyRefreshToken(token: string): RefreshTokenData {
        try {
            return jwt.verify(token, this._refreshTokenSecret) as RefreshTokenData;
        } catch (err) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}
