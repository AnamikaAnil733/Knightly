import { Piece  } from "./Piece";
import {Position} from "../Position";


export class Rook extends Piece{
    readonly type = "ROOK";
    getPseudoLegalMoves(from: Position, board: any): Position[] {
        const moves: Position[] = [];
        const direction =[
            [0,1],[1,0],
            [0,-1],[-1,0]
        ]

        for(const [r,c] of direction){
            let current = from
            while(true){
                current = current.offset(r,c)
                if(!board.isInside(current)) break;
                const target =board.getPiece(current)
                if(!target){
                  moves.push(current);
                  continue;  
                }

                if(target.color !== this.color){
                    moves.push(current)
                }
                break;
            }
        }

        return moves
    }
}