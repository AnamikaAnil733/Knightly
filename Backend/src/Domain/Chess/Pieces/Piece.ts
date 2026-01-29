import { Position } from "../Position";

export abstract class Piece{

    public hasMoved: boolean = false;
    
    constructor(
        public readonly color:"WHITE"|"BLACK"
    ){}

    abstract readonly type: string;

    abstract getPseudoLegalMoves(
        from:Position,
        board:any
    ):Position[]
}