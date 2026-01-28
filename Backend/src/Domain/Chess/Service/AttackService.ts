import { Board } from "../Entities/Board";
import { Position } from "../Position";



export class AttackService{
    static isSquareAttacked(
        square:Position,
        byColor:"WHITE"|"BLACK",
        board:Board,
    ):boolean {
        for(let i =0;i<8;i++){
            for(let j=0;j<8;j++){
           const p =new Position(i,j)
           const piece= board.getPiece(p)
           if(!piece) continue;
           if(piece.color !== byColor) continue;

           const moves = piece.getPseudoLegalMoves(p,board);
           if(moves.some(m=>m.equals(square))){
            return true
           }
            }
        }
        return false
    }
}