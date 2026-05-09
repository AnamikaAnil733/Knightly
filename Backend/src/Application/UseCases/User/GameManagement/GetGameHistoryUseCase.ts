import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { GameHistoryDTO } from "../../../../Domain/DTOs/UserDTOs";
import { GameMapper } from "../../../Mapper/GameMapper";
import IGetGameHistoryUseCase from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameHistoryUseCase";

export class GetGameHistoryUseCase implements IGetGameHistoryUseCase {
  constructor(
    private readonly _gameRepository: IChessGameRepository,
    private readonly _userRepository: IUserManagmentRepository,
  ) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ history: GameHistoryDTO[]; total: number }> {
    if (!userId) throw new Error("User ID is required");

    const skip = (page - 1) * limit;

    const [games, total] = await Promise.all([
      this._gameRepository.findByUserId(userId, skip, limit),
      this._gameRepository.countByUserId(userId),
    ]);

    const history: GameHistoryDTO[] = [];

    for (const game of games) {
      try {
        const whiteId = game.getWhitePlayerId();
        const blackId = game.getBlackPlayerId();

        let whitePlayer = null;
        let blackPlayer = null;

        if (whiteId) {
          if (whiteId === "stockfish-bot") {
            const difficulty = game.getDifficulty() || 1;
            whitePlayer = {
              displayname: `Stockfish Bot (Lvl ${difficulty})`,
              avatarKey:
                "https://upload.wikimedia.org/wikipedia/commons/1/1a/Computer_icon.svg",
            };
          } else {
            whitePlayer = await this._userRepository.findById(whiteId);
          }
        }

        if (blackId) {
          if (blackId === "stockfish-bot") {
            const difficulty = game.getDifficulty() || 1;
            blackPlayer = {
              displayname: `Stockfish Bot (Lvl ${difficulty})`,
              avatarKey:
                "https://upload.wikimedia.org/wikipedia/commons/1/1a/Computer_icon.svg",
            };
          } else {
            blackPlayer = await this._userRepository.findById(blackId);
          }
        }

        history.push(
          GameMapper.toGameHistoryDTO(
            game,
            {
              id: whiteId || "bot",
              displayname: whitePlayer?.displayname || "Bot",
              avatarUrl: whitePlayer?.avatarKey || null,
            },
            {
              id: blackId || "bot",
              displayname: blackPlayer?.displayname || "Bot",
              avatarUrl: blackPlayer?.avatarKey || null,
            },
          ),
        );
      } catch (gameError: any) {
        throw new Error(
          `Failed to process game ${game.id}: ${gameError.message}`,
        );
      }
    }

    return { history, total };
  }
}
