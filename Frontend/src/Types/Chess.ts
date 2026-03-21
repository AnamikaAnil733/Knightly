export type ChessColor = "WHITE" | "BLACK";

export type ChessPiece = {
  type: "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING";
  color: ChessColor;
  hasMoved: boolean;
};

export type BoardGrid = (ChessPiece | null)[][];

export type Position = { row: number; col: number };

export type MoveDTO = {
  from: Position;
  to: Position;
  piece: string;
  color: "WHITE" | "BLACK";
  promotion?: string;
};

export interface AnalysisData {
  classification: string;
  evaluation: {
    score: number;
    mate: number | null;
  };
}
