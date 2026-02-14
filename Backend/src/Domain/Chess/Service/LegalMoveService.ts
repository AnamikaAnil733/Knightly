import { Board } from "../Entities/Board";
import { Position } from "../Position";
import { CheckService } from "./CheckService";



export class LegalService{
  static getLegalMove(
    from:Position,
    board:Board,
  ):Position[]{

    const piece = board.getPiece(from);
    if(!piece) return[];

    const pseudoMoves = piece.getPseudoLegalMoves(from,board);
    return pseudoMoves.filter(to =>{
      if(piece.type === "KING" && Math.abs(to.column-from.column)===2){
        if (CheckService.isKingInCheck(piece.color, board)) {
          return false;
        }
        const direction = to.column > from.column ? 1 : -1;
        const middle = new Position(from.row, from.column + direction);

        const middleBoard = board.clone();
        middleBoard.move(from, middle);

        if (CheckService.isKingInCheck(piece.color, middleBoard)) {
          return false;
        }
      }
      const simulatedBoard = board.clone();
      const ep =board.getEnPassantTarget();
      if(piece.type === "PAWN"
          && ep !== null
          && to.equals(ep)){
        const direction = piece.color === "WHITE"?-1:1;
        const capturedPawnP = to.offset(-direction,0);
        simulatedBoard.setPiece(capturedPawnP,null);
      }
      simulatedBoard.move(from,to);
      return !CheckService.isKingInCheck(
        piece.color,
        simulatedBoard,
      );
    });
  }
}
