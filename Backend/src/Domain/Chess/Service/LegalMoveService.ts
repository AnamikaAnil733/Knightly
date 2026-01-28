import { Board } from "../Entities/Board";
import { Position } from "../Position";
import { CheckService } from "./CheckService";



export class LegalService{
 static getLegalMove(
    from:Position,
    board:Board,
 ):Position[]{

    const piece = board.getPiece(from);
    if(!piece) return[]

    const pseudoMoves = piece.getPseudoLegalMoves(from,board);

    return pseudoMoves.filter(to =>{
        const simulatedBoard = board.clone()
        simulatedBoard.move(from,to)
        return !CheckService.isKingInCheck(
            piece.color,
            simulatedBoard
        )
    })
 }
}