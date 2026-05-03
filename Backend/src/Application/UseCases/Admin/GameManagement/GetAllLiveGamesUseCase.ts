import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { IGetAllLiveGamesUseCase, ILiveGameDTO } from "../../../../Domain/Interface/Usecases/Admin/GameManagement/IGetAllLiveGamesUseCase";
import { LiveGameMapper } from "../../../../Infrastructure/Mapper/LiveGameMapper";

export default class GetAllLiveGamesUseCase implements IGetAllLiveGamesUseCase {
  constructor(
    private readonly gameRepository: IChessGameRepository,
    private readonly userRepository: IBaseRepository<EAuth, string>,
  ) {}

  async execute(): Promise<ILiveGameDTO[]> {
    const liveGames = await this.gameRepository.findAllLiveGames();

    const populatedGames = await Promise.all(
      liveGames.map(async (game) => {
        const whitePlayerId = game.getWhitePlayerId();
        const blackPlayerId = game.getBlackPlayerId();

        const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

        const [whitePlayer, blackPlayer] = await Promise.all([
          whitePlayerId && isValidObjectId(whitePlayerId) ? this.userRepository.findById(whitePlayerId) : null,
          blackPlayerId && isValidObjectId(blackPlayerId) ? this.userRepository.findById(blackPlayerId) : null,
        ]);

        return LiveGameMapper.toDTO(game, whitePlayer, blackPlayer);
      }),
    );

    return populatedGames;
  }
}
