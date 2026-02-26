import { Piece } from "./Piece";
import { Position } from "../Position";

export class Knight extends Piece {
  readonly type = "KNIGHT";
  getPseudoLegalMoves(from: Position, board: any): Position[] {
    const moves = [
      [-1, -2],
      [1, 2],
      [-1, 2],
      [1, -2],
      [-2, 1],
      [2, -1],
      [-2, -1],
      [2, 1],
    ];
    return moves
      .map(([dx, dy]) => from.offset(dx, dy))
      .filter((p) => board.isInside(p))
      .filter((p) => {
        const target = board.getPiece(p);
        return !target || target.color !== this.color;
      });
  }
}
