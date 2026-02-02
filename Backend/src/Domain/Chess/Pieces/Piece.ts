import { Position } from "../Position";
import { PieceType } from "../Types/PieceType";

export abstract class Piece{

    public hasMoved: boolean = false;
    
    constructor(
        public readonly color:"WHITE"|"BLACK"
    ){}

    abstract readonly type: PieceType;

    abstract getPseudoLegalMoves(
        from:Position,
        board:any
    ):Position[]
}