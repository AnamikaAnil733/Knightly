// Application/UseCases/user/profileManagement/GetUserProfileUseCase.ts

import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import EAuth from "../../../../Domain/Entity/Auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IGetUserProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IGetUserProfileUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    private readonly _userRepo: IBaseRepository<EAuth>,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(userId: string) {
    if (userId === "stockfish-bot") {
      return {
        id: "stockfish-bot",
        displayname: "Stockfish Engine (Lvl 1-6)",
        email: "stockfish@engine.local",
        role: "BOT" as any,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        gamesWin: 0,
        rating: { BULLET: 3000, BLITZ: 3000, RAPID: 3000, CLASSICAL: 3000 },
        premium: true,
        longestStreak: 0,
        currentStreak: 0,
        rewards: [],
        achievements: [],
        avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Computer_icon.svg",
      };
    }

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DOESNT_EXIST,
      );
    }
    const avatarUrl = (await this._mediaService.resolveSignedUrl(user.avatarKey)) ?? null;

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
      ratingHistory: user.ratingHistory,
      avatarUrl,
    };
  }
}
