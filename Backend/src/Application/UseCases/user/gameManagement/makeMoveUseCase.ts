import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IMakeMoveUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IMakeMoveUseCase";
import { LegalService } from "../../../../Domain/Chess/Service/LegalMoveService";
import { Position } from "../../../../Domain/Chess/Position";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class MakeMoveUsecase implements IMakeMoveUseCase {
  constructor(private readonly _gameRepo: IChessGameRepository) {}
  async execute(
    gameId: string,
    from: { row: number; col: number },
    to: { row: number; col: number },
    promotionType?: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT",
  ): Promise<void> {
    const game = await this._gameRepo.findById(gameId);

    if (!game) {
      throw new Error(MESSAGES.GAME_NOT_FOUND);
    }

    const gameState = game.getGameState();
    const board = gameState.getBoard();
    const status = gameState.getStatus();

    const fromP = new Position(from.row, from.col);
    const toP = new Position(to.row, to.col);

    const piece = board.getPiece(fromP);

    if (!piece) {
      throw new Error(MESSAGES.PIECE_NOT_FOUND);
    }

    if (piece.color !== gameState.getTurn()) {
      throw new Error(MESSAGES.NOT_YOUR_TURN);
    }

    if(game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK"){
      await this._gameRepo.update(game);
      return;
    }

    const LegalMoves = LegalService.getLegalMove(fromP, board);
    const isLegal = LegalMoves.some(
      (m) => m.row === toP.row && m.column === toP.column,
    );

    if (!isLegal) {
      throw new Error("Illegal move");
    }
    game.updateClock(Date.now());

    if (game.getStatus() === "WHITE_TIMEOUT" || game.getStatus() === "BLACK_TIMEOUT") {
      await this._gameRepo.update(game);
      return;
    }

    gameState.makeMove(fromP, toP, promotionType);
    game.statusFromGameState();

    await this._gameRepo.update(game);
  }
}
