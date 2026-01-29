import { Piece } from "./Piece";
import { Position } from "../Position";


export class King extends Piece{
    readonly type = "KING";
    getPseudoLegalMoves(from: Position, board: any): Position[] {
        const moves: Position[] = [];

        const directions = [
            [0, 1], [1, 0], [-1, 0], [0, -1],
            [-1, -1], [1, 1], [-1, 1], [1, -1]
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
            moves.push(new Position(row, 6));
            moves.push(new Position(row, 2));
          }
      
          return moves;
    }
}