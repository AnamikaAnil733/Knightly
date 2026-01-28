import { Board } from "../Entities/Board";
import { Position } from "../Position";
import { AttackService } from "./AttackService";
import { Piece } from "../Pieces/Piece";


export class CheckService{
    static isKingInCheck(
        color:"WHITE"|"BLACK",
        board:Board,
    ):boolean{
        let kingPosition:Position|null = null
        for(let i=0;i<8  && !kingPosition;i++){
         for(let j =0;j<8;j++){
            const p = new Position(i,j);
            const piece = board.getPiece(p)
            if(piece&&piece.color ==color && piece.type=="KING"){
                kingPosition =p
                break;
            }
         }
        }
        if (!kingPosition) {
            throw new Error("King not found on board");
          }

          const opponentColor = color === "WHITE" ? "BLACK" : "WHITE";

          return AttackService.isSquareAttacked(
            kingPosition,
            opponentColor,
            board
          );
    }
}