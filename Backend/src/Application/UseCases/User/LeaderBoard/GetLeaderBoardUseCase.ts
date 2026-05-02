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

      const averageRating =Math.floor((user.rating.BULLET +user.rating.BLITZ+user.rating.RAPID+user.rating.CLASSICAL)/4)
      console.log(typeof user.gamesWin);
      return {
        rank: index + 1,
        displayname: user.displayname,
        avatarKey: avatarUrl || "",
        rating: user.rating[gameType],
        averageRating,
        win:user.gamesWin,
        streak:user.currentStreak,
      };
    }));

  }
}
