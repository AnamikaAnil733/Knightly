import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { GameHistoryDTO } from "../../../../Domain/DTOs/UserDTOs";

export class GetGameHistoryUseCase {
  constructor(
    private readonly _gameRepository: IChessGameRepository,
    private readonly _userRepository: IUserManagmentRepository,
  ) {}

  async execute(userId: string): Promise<GameHistoryDTO[]> {
    if (!userId) throw new Error("User ID is required");


    const games = await this._gameRepository.findByUserId(userId);

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
              avatarKey: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Computer_icon.svg",
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
              avatarKey: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Computer_icon.svg",
            };
          } else {
            blackPlayer = await this._userRepository.findById(blackId);
          }
        }

        history.push({
          id: game.id!,
          whitePlayer: {
            id: whiteId || "bot",
            displayname: whitePlayer?.displayname || "Bot",
            avatarUrl: whitePlayer?.avatarKey || null,
          },
          blackPlayer: {
            id: blackId || "bot",
            displayname: blackPlayer?.displayname || "Bot",
            avatarUrl: blackPlayer?.avatarKey || null,
          },
          status: game.getStatus(),
          createdAt: game.getCreatedAt()?.toISOString() || new Date().toISOString(),
          timeControl: game.getTimeControl(),
          whiteRatingChange: game.getWhiteRatingChange(),
          blackRatingChange: game.getBlackRatingChange(),
        });
      } catch (gameError: any) {
        throw new Error(`Failed to process game ${game.id}: ${gameError.message}`);
      }
    }

    return history;
  }
}
