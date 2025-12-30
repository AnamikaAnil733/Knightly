import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import { AuthResponseDTO } from "../../DTOs/authDTO";
import { AuthMapper } from "../../mapper/AuthMapper";
import { IGoogleAuthUseCase } from "../../../Domain/Interface/usecases/authentication/IGoogleAuthUseCase";
import { GoogleAuthRequestDTO } from "../../DTOs/googleAuthDTO";
import EAuth from "../../../Domain/Entity/auth";
import { IGoogleAuthService } from "../../../Domain/Interface/service/IGoogleAuthService";
import { ITokenService } from "../../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../../Domain/Types/UserRole";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private _authRepository: IUserRepository,
    private _googleAuthService: IGoogleAuthService,
    private _tokenService :ITokenService,
  ) {}

  async execute(data: GoogleAuthRequestDTO): Promise<AuthResponseDTO> {
    if (!data.token) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_GOOGLE_TOKEN
      );
    }

    const payload = await this._googleAuthService.verifyIdToken(data.token);

    if (!payload.email) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.INVALID_GOOGLE_TOKEN
      );
    }

    let user = await this._authRepository.findByEmail(payload.email);

    if (user && user.isBlocked) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.USER_BLOCKED
      );
    }

    if (!user) {
      user = await this._authRepository.create(
        new EAuth({
          displayname: payload.name || payload.email.split("@")[0], // fallback name
          email: payload.email,
          googleId: payload.sub,
          isNewUser: true,
          isBlocked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          role:UserRole.USER

        })
      );
    } else {
      user.isNewUser = false;
    }
    const accessToken = this._tokenService.generateAccessToken({
      userId: user.id!,
      role: user.role
  });

    return AuthMapper.toAuthResponseDTOfromEntity(user,accessToken);
  }
}
