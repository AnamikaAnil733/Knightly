import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { GameOutputDTO } from "../../../../Domain/DTOs/UserDTOs";
import { IGetGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/IGetGameUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";

export class GetGameUseCase implements IGetGameUseCase {
  constructor(
    private readonly _chessGameRepository: IChessGameRepository,
    private readonly _userRepo: IBaseRepository<EAuth>,
    private readonly _storageService: IStorageService
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

    let whitePlayer, blackPlayer;

    if (whiteId) {
      const user = await this._userRepo.findById(whiteId);
      if (user) {
        whitePlayer = {
          name: user.displayname,
          rating: user.getRating("BLITZ"),
          avatar: user.avatarKey
            ? await this._storageService.generateSignedGetUrl(
                user.avatarKey,
                43200 // 12 hours
              )
            : null,
        };
      }
    }

    if (blackId) {
      const user = await this._userRepo.findById(blackId);
      if (user) {
        blackPlayer = {
          name: user.displayname,
          rating: user.getRating("BLITZ"),
          avatar: user.avatarKey
            ? await this._storageService.generateSignedGetUrl(
                user.avatarKey,
                43200 // 12 hours
              )
            : null,
        };
      }
    }

    return {
      gameId: game.id!,
      turn: gameState.getTurn(),
      board: board.serialize(),
      history: gameState.getHistory().map((move) => ({
        from: {
          row: move.from.row,
          col: move.from.column,
        },
        to: {
          row: move.to.row,
          col: move.to.column,
        },
        piece: move.pieceType,
        color: move.color,
      })),

      status: game.getStatus(),

      clock: {
        whiteTime: liveTimes.whiteTime,
        blackTime: liveTimes.blackTime,
        increment: clock.increment,
        turn: clock.turn,
      },
      whitePlayer,
      blackPlayer,
    };
  }
}
