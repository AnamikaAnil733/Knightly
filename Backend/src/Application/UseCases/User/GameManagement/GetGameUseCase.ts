import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { GameOutputDTO } from "../../../../Domain/DTOs/UserDTOs";
import { IGetGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { IMediaService } from "../../../../Domain/Interface/Service/IMediaService";
import { TIME_CONTROLS } from "../../../../Domain/Chess/Types/GameFormat";
import { GameMapper } from "../../../Mapper/GameMapper";

export class GetGameUseCase implements IGetGameUseCase {
  constructor(
    private readonly _chessGameRepository: IChessGameRepository,
    private readonly _userRepo: IBaseRepository<EAuth>,
    private readonly _mediaService: IMediaService,
  ) {}

  async execute(gameId: string): Promise<GameOutputDTO> {
    const game = await this._chessGameRepository.findById(gameId);

    if (!game) {
      throw new Error(MESSAGES.GAME_NOT_FOUND);
    }

    const gameState = game.getGameState();
    const board = gameState.getBoard();
    const clock = game.getClock();
    const liveTimes = clock.getLiveTimes();

    // Auto-update status if time expired
    if (game.checkPassiveTimeout()) {
      await this._chessGameRepository.update(game);
    }

    const whiteId = game.getWhitePlayerId();
    const blackId = game.getBlackPlayerId();

    let whitePlayer: { id: string; name: string; rating: number; avatar: string | null } | undefined;
    let blackPlayer: { id: string; name: string; rating: number; avatar: string | null } | undefined;

    const timeControlConfig = TIME_CONTROLS[game.getTimeControl()] || TIME_CONTROLS["5+0"];
    const ratingMode = timeControlConfig.mode;

    const isBotMatch = whiteId === "stockfish-bot" || blackId === "stockfish-bot";
    const modeName = isBotMatch ? "Play Computer" : ratingMode;

    if (whiteId) {
      if (whiteId === "stockfish-bot") {
        const difficulty = game.getDifficulty() || 1;
        const botRating = 400 * difficulty;
        whitePlayer = {
          id: "stockfish-bot",
          name: "Stockfish Engine (Lvl " + difficulty + ")",
          rating: botRating,
          avatar: "/images/stockfish-avatar.png",
        };
      } else {
        const user = await this._userRepo.findById(whiteId);
        if (user) {
          whitePlayer = {
            id: user.id!,
            name: user.displayname,
            rating: user.getRating(ratingMode),
            avatar: (await this._mediaService.resolveSignedUrl(user.avatarKey)) ?? null,
          };
        }
      }
    }

    if (blackId) {
      if (blackId === "stockfish-bot") {
        const difficulty = game.getDifficulty() || 1;
        const botRating = 400 * difficulty;
        blackPlayer = {
          id: "stockfish-bot",
          name: "Stockfish Engine (Lvl " + difficulty + ")",
          rating: botRating,
          avatar: "/images/stockfish-avatar.png",
        };
      } else {
        const user = await this._userRepo.findById(blackId);
        if (user) {
          blackPlayer = {
            id: user.id!,
            name: user.displayname,
            rating: user.getRating(ratingMode),
            avatar: (await this._mediaService.resolveSignedUrl(user.avatarKey)) ?? null,
          };
        }
      }
    }

    return GameMapper.toGameOutputDTO(game, whitePlayer, blackPlayer, modeName);
  }
}
