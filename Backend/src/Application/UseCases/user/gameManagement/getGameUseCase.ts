import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { GameOutputDTO } from "../../../../Domain/DTOs/userDTOs";
import { IGetGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IGetGameUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class GetGameUseCase implements IGetGameUseCase{
  constructor(
        private readonly _chessGameRepository:IChessGameRepository,
  ){}

  async execute(gameId: string): Promise<GameOutputDTO> {

    const game = await this._chessGameRepository.findById(gameId);

    if(!game){
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
    
    return{
      gameId:game.id!,
      turn:gameState.getTurn(),
      board:board.serialize(),
      history: gameState.getHistory().map(move => ({
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

      status:game.getStatus(),

      clock: {
        whiteTime: liveTimes.whiteTime,
        blackTime: liveTimes.blackTime,
        increment: clock.increment,
        turn: clock.turn,
      }

    };

  }
}
