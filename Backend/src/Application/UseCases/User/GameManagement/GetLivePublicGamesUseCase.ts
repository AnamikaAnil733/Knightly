import { IGetLivePublicGamesUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetLivePublicGamesUseCase";
import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { ChessGame } from "../../../../Domain/Entity/ChessGame";

export class GetLivePublicGamesUseCase implements IGetLivePublicGamesUseCase {
  constructor(private readonly gameRepository: IChessGameRepository) {}

  async execute(): Promise<ChessGame[]> {
    return await this.gameRepository.findLivePublicGames();
  }
}
