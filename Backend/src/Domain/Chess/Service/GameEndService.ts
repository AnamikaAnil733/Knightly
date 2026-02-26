import { Board } from "../Entities/Board";
import { Position } from "../Position";
import { LegalService } from "./LegalMoveService";
import { CheckService } from "./CheckService";

export class GameEndService {
  static hasAnyLegalMove(color: "WHITE" | "BLACK", board: Board): boolean {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const p = new Position(i, j);
        const piece = board.getPiece(p);

        if (!piece) continue;
        if (piece.color !== color) continue;

        const moves = LegalService.getLegalMove(p, board);
        if (moves.length > 0) return true;
      }
    }
    return false;
  }

  static isCheckMate(color: "WHITE" | "BLACK", board: Board): boolean {
    return (
      CheckService.isKingInCheck(color, board) &&
      !this.hasAnyLegalMove(color, board)
    );
  }

  static isStaleMate(color: "WHITE" | "BLACK", board: Board): boolean {
    return (
      !CheckService.isKingInCheck(color, board) &&
      !this.hasAnyLegalMove(color, board)
    );
  }
}
