import { SerializedBoardGrid } from "../../../Domain/Chess/Types/SerializedBoard";

export interface ChessGameSchema {
  _id: string;
  turn: "WHITE" | "BLACK";
  board: SerializedBoardGrid;
  history: any[];         
  status: "ACTIVE" | "CHECKMATE" | "STALEMATE";
  createdAt: Date;
  updatedAt: Date;
}
