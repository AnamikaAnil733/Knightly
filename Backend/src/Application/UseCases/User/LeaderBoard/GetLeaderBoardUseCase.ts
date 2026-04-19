import { IGetLeaderBoardUseCase } from "../../../../Domain/Interface/Usecases/User/LeaderBoard/ILeaderBoard";
import { ILeaderBoardRepository } from "../../../../Domain/Interface/Repositories/ILeaderBoardRepository";
import { LeaderBoardResponse } from "../../../../Domain/DTOs/UserDTOs";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";


export class GetLeaderBoardUseCase implements IGetLeaderBoardUseCase{
  constructor(
        private readonly _leaderRepo: ILeaderBoardRepository,
        private readonly _mediaService: IMediaService,
  ){}

  async execute(type: string): Promise<LeaderBoardResponse[]> {
    const gameType = type.toUpperCase() as keyof any;
    const users = await this._leaderRepo.getTopPlayersByType(type, 10);

    return Promise.all(users.map(async (user, index) => {
      const avatarUrl = await this._mediaService.resolveSignedUrl(user.avatarKey);

      const ratings = Object.values(user.rating).filter((r): r is number => typeof r === "number");
      const averageRating = ratings.length > 0
        ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
        : 0;

      return {
        rank: index + 1,
        displayname: user.displayname,
        avatarKey: avatarUrl || "",
        rating: user.rating[gameType],
        averageRating,
      };
    }));

  }
}
