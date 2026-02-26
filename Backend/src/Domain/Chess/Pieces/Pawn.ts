import { Piece } from "./Piece";
import { Position } from "../Position";

export class Pawn extends Piece {
  readonly type = "PAWN";
  getPseudoLegalMoves(from: Position, board: any): Position[] {
    const moves: Position[] = [];

    const d = this.color === "WHITE" ? -1 : 1;
    const sRow = this.color === "WHITE" ? 6 : 1;

    const oneStep = from.offset(d, 0);
    if (board.isInside(oneStep) && !board.getPiece(oneStep)) {
      moves.push(oneStep);
    }

    if (
      from.row === sRow &&
      board.isInside(oneStep) &&
      !board.getPiece(oneStep)
    ) {
      const twoStep = from.offset(d * 2, 0);
      if (board.isInside(twoStep) && !board.getPiece(twoStep)) {
        moves.push(twoStep);
      }
    }

    const captures = [from.offset(d, -1), from.offset(d, 1)];

    for (const p of captures) {
      if (!board.isInside(p)) continue;

      const target = board.getPiece(p);
      if (target && target.color !== this.color) {
        moves.push(p);
      }
    }

    const ep = board.getEnPassantTarget();

    if (ep) {
      const direction = this.color === "WHITE" ? -1 : 1;

      const isCorrectRow = ep.row === from.row + direction;
      const isAdjacentFile = Math.abs(ep.column - from.column) === 1;

      if (isCorrectRow && isAdjacentFile) {
        moves.push(ep);
      }
    }

    return moves;
  }
}
