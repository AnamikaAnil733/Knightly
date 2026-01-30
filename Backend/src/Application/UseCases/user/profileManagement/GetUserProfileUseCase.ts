// Application/UseCases/user/profileManagement/GetUserProfileUseCase.ts

import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseRepository";
import { IStorageService } from "../../../../Domain/Interface/service/S3Service";
import EAuth from "../../../../Domain/Entity/auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IGetUserProfileUseCase } from "../../../../Domain/Interface/usecases/user/ProfileManagement/IGetUserProfileUseCase";

export class GetUserProfileUseCase implements IGetUserProfileUseCase{
  constructor(
    private readonly _userRepo: IBaseRepository<EAuth>,
    private readonly _storageService: IStorageService
  ) {}

  async execute(userId: string) {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "User not found"
      );
    }
    const avatarUrl = user.avatarKey
      ? await this._storageService.generateSignedGetUrl(
          user.avatarKey,
          300
        )
      : null;


      return {
        id: user.id!,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt.toISOString(),
  
        gamesPlayed: user.gamesPlayed,
        gamesWin: user.gamesWin,
        rating: user.rating,
        premium: user.premium,
  
        longestStreak: user.longestStreak,
        currentStreak: user.currentStreak,
  
        rewards: user.rewards,
        achievements: user.achievements,
  
        avatarUrl,
      };
  }
}
