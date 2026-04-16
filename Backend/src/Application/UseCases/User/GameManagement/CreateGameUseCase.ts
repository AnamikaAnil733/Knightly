import { ChessGame } from "../../../../Domain/Entity/ChessGame";
import { GameState } from "../../../../Domain/Chess/Game/GameState";
import { InitialBoard } from "../../../../Domain/Chess/InitialBoard";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { ICreateGameUseCase } from "../../../../Domain/Interface/Usecases/User/GameManagement/ICreateGameUseCase";
import { GameClock } from "../../../../Domain/Entity/GameClock";
import { TIME_CONTROLS } from "../../../../Domain/Chess/Types/GameFormat";

export class CreateGameUseCase implements ICreateGameUseCase{
  constructor(
        private readonly ChessGameRepository : IBaseRepository<ChessGame>,
  ){}

  async execute(whitePlayerId?: string, blackPlayerId?: string, timeControl: string = "5+0", difficulty?: number, isPublic: boolean = false): Promise<{ gameId: string }> {
    let config = TIME_CONTROLS[timeControl];

    if (!config && timeControl.startsWith("level-")) {
      config = { ...TIME_CONTROLS["NO_TIMER"], name: timeControl };
    }

    if (!config) config = TIME_CONTROLS["5+0"];

    const board = InitialBoard.create();
    const gameState = new GameState(board);
    const clock = new GameClock(
      config.whiteTime,
      config.blackTime,
      config.increment,
      "WHITE",         // starting turn
      Date.now(),       // lastMoveTimestamp
    );

    const game = new ChessGame(
      gameState,
      "ACTIVE",
      clock,
      whitePlayerId,
      blackPlayerId,
      config.name,
      undefined,
      false,
      undefined, // whiteRatingChange
      undefined, // blackRatingChange
      difficulty,
      isPublic,
    );

    const savedGame = await this.ChessGameRepository.create(game);
    return { gameId :savedGame.id!};
  }
}

