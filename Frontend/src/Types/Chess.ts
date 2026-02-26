export type ChessColor = "WHITE" | "BLACK";

export type ChessPiece = {
  type: "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING";
  color: ChessColor;
  hasMoved: boolean;
};

export type BoardGrid = (ChessPiece | null)[][];
