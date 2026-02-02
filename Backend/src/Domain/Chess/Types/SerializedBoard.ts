import { PieceType } from "./PieceType";

export type SerializedPiece  = {
    type: PieceType;
    color: "WHITE"|"BLACK";
    hasMoved:boolean;
}|null;



export type SerializedBoardGrid = SerializedPiece[][];