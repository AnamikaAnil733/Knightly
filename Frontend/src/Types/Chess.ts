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
  description: string;
  evaluation: {
    score: number;
    mate: number | null;
  };
}
export interface TimeControlOption {
  id: string; // The backend code, e.g., "1+0"
  label: string; // The display label, e.g., "1 | 0"
}

export interface GameMode {
  id: string;
  name: string;
  duration: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  options: TimeControlOption[];
}

export type Turn = "WHITE" | "BLACK";

export type GameStatus =
  | "ACTIVE"
  | "CHECK"
  | "CHECKMATE"
  | "STALEMATE"
  | "WHITE_TIMEOUT"
  | "BLACK_TIMEOUT"
  | "WHITE_RESIGNED"
  | "BLACK_RESIGNED"
  | "DRAW_BY_REPETITION"
  | "DRAW_BY_FIFTY_MOVES"
  | "DRAW_BY_INSUFFICIENT_MATERIAL";
