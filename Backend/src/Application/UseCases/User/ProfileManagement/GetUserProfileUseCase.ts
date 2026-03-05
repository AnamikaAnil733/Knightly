// Application/UseCases/user/profileManagement/GetUserProfileUseCase.ts

import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import EAuth from "../../../../Domain/Entity/Auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IGetUserProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IGetUserProfileUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    private readonly _userRepo: IBaseRepository<EAuth>,
    private readonly _storageService: IStorageService
  ) {}

  async execute(userId: string) {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DOESNT_EXIST
      );
    }
    const avatarUrl = user.avatarKey
      ? await this._storageService.generateSignedGetUrl(user.avatarKey, 43200) // 12 hours
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
      rating: user.rating.getAll(),
      premium: user.premium,

      longestStreak: user.longestStreak,
      currentStreak: user.currentStreak,

      rewards: user.rewards,
      achievements: user.achievements,

      avatarUrl,
    };
  }
}
