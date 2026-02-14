import { Piece } from "./Piece";
import { Position } from "../Position";



export class King extends Piece{
  readonly type = "KING";
  getPseudoLegalMoves(from: Position, board: any): Position[] {
    const moves: Position[] = [];

    const directions = [
      [0, 1], [1, 0], [-1, 0], [0, -1],
      [-1, -1], [1, 1], [-1, 1], [1, -1],
    ];

    for (const [dr, dc] of directions) {
      const to = from.offset(dr, dc);
      if (!board.isInside(to)) continue;

      const target = board.getPiece(to);
      if (!target || target.color !== this.color) {
        moves.push(to);
      }
    }

    if (!this.hasMoved) {
      const row = from.row;

      const rookK = board.getPiece(new Position(row, 7));
      if (rookK && rookK.type === "ROOK" && !rookK.hasMoved) {

        if (
          !board.getPiece(new Position(row, 5)) &&
      !board.getPiece(new Position(row, 6))
        ) {
          moves.push(new Position(row, 6));
        }
      }

      const rookQ = board.getPiece(new Position(row, 0));
      if (rookQ && rookQ.type === "ROOK" && !rookQ.hasMoved) {
        if (
          !board.getPiece(new Position(row, 1)) &&
      !board.getPiece(new Position(row, 2)) &&
      !board.getPiece(new Position(row, 3))
        ) {
          moves.push(new Position(row, 2));
        }
      }
    }


    return moves;
  }
}
