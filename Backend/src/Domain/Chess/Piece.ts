import { Position } from "./Position";

export abstract class Piece{
    constructor(
        public readonly color:"WHITE"|"BLACK"
    ){}

    abstract getPseudoLegalMoves(
        from:Position,
        board:any
    ):Position[]
}