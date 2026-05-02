import { IGetLeaderBoardUseCase } from "../../../../Domain/Interface/Usecases/User/LeaderBoard/ILeaderBoard";
import { ILeaderBoardRepository } from "../../../../Domain/Interface/Repositories/ILeaderBoardRepository";
import { LeaderBoardResponse } from "../../../../Domain/DTOs/UserDTOs";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import { LeaderBoardMapper } from "../../../Mapper/LeaderBoardMapper";


export class GetLeaderBoardUseCase implements IGetLeaderBoardUseCase{
  constructor(
        private readonly _leaderRepo: ILeaderBoardRepository,
        private readonly _mediaService: IMediaService,
  ){}

  async execute(type: string): Promise<LeaderBoardResponse[]> {
    const users = await this._leaderRepo.getTopPlayersByType(type, 10);

    return Promise.all(users.map(async (user, index) => {
      const avatarUrl = await this._mediaService.resolveSignedUrl(user.avatarKey);
      return LeaderBoardMapper.toLeaderBoardResponse(user, index, avatarUrl || "", type);
    }));

  }
}
