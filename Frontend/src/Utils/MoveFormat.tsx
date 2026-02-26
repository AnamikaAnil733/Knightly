const alpha = ["a", "b", "c", "d", "e", "f", "g", "h"];

type Position = { row: number; col: number };

type MoveDTO = {
  from: Position;
  to: Position;
  piece: string;
  color: "WHITE" | "BLACK";
  promotion?: string;
};

export function toSquare(p: Position) {
  return `${alpha[p.col]}${8 - p.row}`;
}

export function pieceLetter(pieceType: string): string {
  switch (pieceType) {
    case "KNIGHT":
      return "N";
    case "BISHOP":
      return "B";
    case "KING":
      return "K";
    case "QUEEN":
      return "Q";
    case "ROOK":
      return "R";
    default:
      return "";
  }
}

export function formatMove(
  move: MoveDTO,
  option?: {
    isCheck?: boolean;
    isCheckmate?: boolean;
    isStalemate?: boolean;
  }
): string {
  let notation = "";

  if (move.piece === "KING" && Math.abs(move.from.col - move.to.col) === 2) {
    notation = move.to.col === 6 ? "O-O" : "O-O-O";
  } else if (move.piece === "PAWN") {
    const isCapture = move.from.col !== move.to.col;
    if (isCapture) {
      notation = `${toSquare(move.from)}x${toSquare(move.to)}`;
    } else {
      notation = toSquare(move.to);
    }
    if (move.promotion) {
      notation += `=${pieceLetter(move.promotion)}`;
    }
  } else {
    notation = pieceLetter(move.piece);
    notation += toSquare(move.to);
  }

  if (option?.isCheckmate) {
    notation += "#";
  } else if (option?.isCheck) {
    notation += "+";
  }

  return notation;
}
