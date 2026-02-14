import { ChessGame } from "../../../../Domain/Entity/chessGame";
import { GameState } from "../../../../Domain/Chess/Game/GameState";
import { InitialBoard } from "../../../../Domain/Chess/InitialBoard";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseRepository";
import { ICreateGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/ICreateGameUseCase";


export class CreateGameUseCase implements ICreateGameUseCase{
  constructor(
        private readonly ChessGameRepository : IBaseRepository<ChessGame>,
  ){}

  async execute(): Promise<{ gameId: string }> {
    const board = InitialBoard.create();
    const gameState = new GameState(board);

    const game = new ChessGame(
      gameState,
      "ACTIVE",
            undefined as any,
    );

    const savedGame = await this.ChessGameRepository.create(game);
    return { gameId :savedGame.id!};
  }
}

