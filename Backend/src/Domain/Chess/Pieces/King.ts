import { Piece } from "../Piece";
import { Position } from "../Position";


export class King extends Piece{
    getPseudoLegalMoves(from: Position, board: any): Position[] {
        const moves =[
            [0,1],[1,0],[-1,0],[0,-1],
            [-1,-1],[1,1],[-1,1],[1,-1]
        ]
        return moves.map(([x,y])=>from.offset(x,y))
                    .filter(p=>board.isInside(p))
                    .filter((p)=>{
                        const target = board.getPiece(p);
                        return !target||target.color !== this.color
                    })
    }
}