import { Chess } from "chess.js";
import { BoardGrid, ChessPiece, MoveDTO } from "../Types/ChessTypes";

export const fenToBoardGrid = (fen: string): BoardGrid => {
  const chess = new Chess(fen);
  const board = chess.board();

  return board.map((row) =>
    row.map((cell) => {
      if (!cell) return null;

      let type: ChessPiece["type"] = "PAWN";
      switch (cell.type) {
        case "p":
          type = "PAWN";
          break;
        case "r":
          type = "ROOK";
          break;
        case "n":
          type = "KNIGHT";
          break;
        case "b":
          type = "BISHOP";
          break;
        case "q":
          type = "QUEEN";
          break;
        case "k":
          type = "KING";
          break;
      }

      return {
        type,
        color: cell.color === "w" ? "WHITE" : "BLACK",
        hasMoved: false,
      };
    }),
  );
};

export const movesToFens = (moves: MoveDTO[]): string[] => {
  const chess = new Chess();
  const fens = [chess.fen()];

  for (const move of moves) {
    const fromAlg =
      String.fromCharCode(97 + move.from.col) + (8 - move.from.row);
    const toAlg = String.fromCharCode(97 + move.to.col) + (8 - move.to.row);
    const promoMap: Record<string, string> = {
      QUEEN: "q",
      ROOK: "r",
      BISHOP: "b",
      KNIGHT: "n",
    };

    try {
      chess.move({
        from: fromAlg as import("chess.js").Square,
        to: toAlg as import("chess.js").Square,
        promotion: move.promotion ? promoMap[move.promotion] : undefined,
      });
      fens.push(chess.fen());
    } catch (e) {
      console.error("Invalid move for chess.js", move, e);
      fens.push(chess.fen());
    }
  }

  return fens;
};

export const findCheckSquare = (
  fen: string,
): { row: number; col: number } | null => {
  const chess = new Chess(fen);
  if (!chess.inCheck()) return null;

  const turn = chess.turn();
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === "k" && piece.color === turn) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};
