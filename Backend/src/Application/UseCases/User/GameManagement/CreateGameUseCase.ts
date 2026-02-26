import { ChessGame } from "../../../../Domain/Entity/ChessGame";
import { GameState } from "../../../../Domain/Chess/Game/GameState";
import { InitialBoard } from "../../../../Domain/Chess/InitialBoard";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { ICreateGameUseCase } from "../../../../Domain/Interface/usecases/User/gameManagement/ICreateGameUseCase";
import { GameClock } from "../../../../Domain/Entity/GameClock";

export class CreateGameUseCase implements ICreateGameUseCase {
  constructor(
    private readonly ChessGameRepository: IBaseRepository<ChessGame>
  ) {}

  async execute(
    whitePlayerId?: string,
    blackPlayerId?: string
  ): Promise<{ gameId: string }> {
    const board = InitialBoard.create();
    const gameState = new GameState(board);
    const clock = new GameClock(
      5 * 60 * 1000, // whiteTime (5 minutes)
      5 * 60 * 1000, // blackTime
      2000, // increment (2 seconds)
      "WHITE", // starting turn
      Date.now() // lastMoveTimestamp
    );

    const game = new ChessGame(
      gameState,
      "ACTIVE",
      clock,
      whitePlayerId,
      blackPlayerId
    );

    const savedGame = await this.ChessGameRepository.create(game);
    return { gameId: savedGame.id! };
  }
}
