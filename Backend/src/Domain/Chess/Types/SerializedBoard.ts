export type SerializedPiece  = {
    type: string;
    color: "WHITE"|"BLACK";
    hasMoved?:boolean;
}|null;



export type SerializedBoardGrid = SerializedPiece[][];