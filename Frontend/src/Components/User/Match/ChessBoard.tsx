import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Piece_Images } from "../../Reuseable/ChessPieces";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { BOARD_THEMES } from "./BoardThemes";

type ChessColor = "WHITE" | "BLACK";

type ChessPiece = {
  type: "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING";
  color: ChessColor;
  hasMoved: boolean;
};

type ChessboardProps = {
  board: (ChessPiece | null)[][];
  selectedSquare?: { row: number; col: number } | null;
  legalMoves?: { row: number; col: number; type?: "EN_PASSANT" | "NORMAL" }[];
  onSquareClick?: (row: number, col: number) => void;
  orientation?: "white" | "black";
  hintSquare?: { row: number; col: number } | null;
};

interface PositionedPiece extends ChessPiece {
  id: string;
  row: number;
  col: number;
}

// Module-level counter so piece IDs are globally unique and never reset
let pieceIdCounter = 0;

export function Chessboard({
  board,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
  orientation = "white",
  hintSquare = null,
}: ChessboardProps) {
  const isFlipped = orientation === "black";

  const getVisualRow = (idx: number) => (isFlipped ? 7 - idx : idx);
  const getVisualCol = (idx: number) => (isFlipped ? 7 - idx : idx);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // --- Piece Tracking Logic ---
  const [pieces, setPieces] = useState<PositionedPiece[]>([]);
  const [prevBoardRef, setPrevBoardRef] = useState<
    (ChessPiece | null)[][] | null
  >(null);

  useEffect(() => {
    if (!board || board.length === 0) return;
    if (prevBoardRef === board) return;

    const currentPieces = pieces;

    if (currentPieces.length === 0) {
      const initial: PositionedPiece[] = [];
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            initial.push({
              ...cell,
              id: `piece-${pieceIdCounter++}`,
              row: r,
              col: c,
            });
          }
        });
      });
      setPieces(initial);
      setPrevBoardRef(board);
      return;
    }

    const pieceMap = new Map<string, PositionedPiece>();
    currentPieces.forEach((p) => pieceMap.set(`${p.row}-${p.col}`, p));

    const result: PositionedPiece[] = [];
    const matchedNew = new Set<string>();
    const matchedOld = new Set<string>();

    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const old = pieceMap.get(`${r}-${c}`);
        if (old && old.type === cell.type && old.color === cell.color) {
          result.push({ ...old, ...cell, row: r, col: c });
          matchedNew.add(`${r}-${c}`);
          matchedOld.add(old.id);
        }
      });
    });

    const disappeared = currentPieces.filter((p) => !matchedOld.has(p.id));
    const appeared: { cell: ChessPiece; r: number; c: number }[] = [];
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && !matchedNew.has(`${r}-${c}`)) {
          appeared.push({ cell, r, c });
        }
      });
    });

    appeared.forEach((app) => {
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < disappeared.length; i++) {
        const dis = disappeared[i];
        if (
          dis.type === app.cell.type &&
          dis.color === app.cell.color &&
          !matchedOld.has(dis.id)
        ) {
          const dist = Math.abs(dis.row - app.r) + Math.abs(dis.col - app.c);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = i;
          }
        }
      }
      if (bestIdx >= 0) {
        const dis = disappeared[bestIdx];
        result.push({ ...dis, ...app.cell, row: app.r, col: app.c });
        matchedOld.add(dis.id);
      } else {
        result.push({
          ...app.cell,
          id: `piece-${pieceIdCounter++}`,
          row: app.r,
          col: app.c,
        });
      }
    });

    setPieces(result);
    setPrevBoardRef(board);
  }, [board, prevBoardRef, pieces]);

  const themeKey = useSelector(
    (state: RootState) => state.ui.boardTheme,
  ) as keyof typeof BOARD_THEMES;
  const theme = BOARD_THEMES[themeKey] || BOARD_THEMES.classic;

  return (
    <div className="relative w-full max-w-[800px] aspect-square mx-auto">
      {/* Glowing frame */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] blur-xl opacity-30 pointer-events-none" />

      {/* Board container */}
      <div
        className="relative w-full h-full rounded-lg overflow-hidden border-2 border-[#3A6FF7]/50 shadow-2xl"
        style={{
          boxShadow:
            "0 0 40px rgba(106, 126, 176, 0.3), 0 0 80px rgba(107, 46, 255, 0.2)",
        }}
      >
        {/* 8x8 grid */}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {Array.from({ length: 8 }).map((_, displayRowIndex) => {
            const actualRowIndex = getVisualRow(displayRowIndex);

            return Array.from({ length: 8 }).map((_, displayColIndex) => {
              const actualColIndex = getVisualCol(displayColIndex);

              const isLight = (actualRowIndex + actualColIndex) % 2 === 0;

              const isSelected =
                selectedSquare?.row === actualRowIndex &&
                selectedSquare?.col === actualColIndex;

              const isLegalMove = legalMoves.some(
                (m) => m.row === actualRowIndex && m.col === actualColIndex,
              );

              const isEnPassant = legalMoves.some(
                (m) =>
                  m.row === actualRowIndex &&
                  m.col === actualColIndex &&
                  m.type === "EN_PASSANT",
              );

              const isHinted =
                hintSquare?.row === actualRowIndex &&
                hintSquare?.col === actualColIndex;

              return (
                <div
                  key={`${actualRowIndex}-${actualColIndex}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onSquareClick?.(actualRowIndex, actualColIndex);
                  }}
                  className={`
                   relative
                   w-full h-full
                   flex items-center justify-center
                   cursor-pointer select-none
                   transition-all duration-200
                   ${isSelected ? "ring-4 ring-inset" : ""}
                   ${
                     isLegalMove
                       ? isEnPassant
                         ? "after:absolute after:w-5 after:h-5 after:border-2 after:bg-[#394f64] after:rounded-full after:z-50"
                         : "after:absolute after:w-4 after:h-4 after:bg-[#394f64]/80 after:rounded-full after:z-50"
                       : ""
                   }
                   
                 `}
                  style={{
                    backgroundColor: isSelected
                      ? theme.selected
                      : isHinted
                        ? "rgba(58, 111, 247, 0.4)" // Match primary blue with transparency
                        : isLight
                          ? theme.light
                          : theme.dark,
                    borderColor: isSelected ? theme.selected : "transparent",
                    borderRight:
                      displayColIndex < 7
                        ? "1px solid rgba(255, 209, 102, 0.1)"
                        : "none",
                    borderBottom:
                      displayRowIndex < 7
                        ? "1px solid rgba(255, 209, 102, 0.1)"
                        : "none",
                  }}
                >
                  {/* Rank Numbers (1-8) - Top Left of first col */}
                  {displayColIndex === 0 && (
                    <span
                      className={`absolute top-0.5 left-0.5 text-[15px] sm:text-s font-bold leading-none select-none`}
                      style={{ color: isLight ? theme.dark : theme.light }}
                    >
                      {displayRanks[displayRowIndex]}
                    </span>
                  )}

                  {/* File Letters (a-h) - Bottom Right of last row */}
                  {displayRowIndex === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-0.5 text-[15px] sm:text-s font-bold leading-none select-none`}
                      style={{ color: isLight ? theme.dark : theme.light }}
                    >
                      {displayFiles[displayColIndex]}
                    </span>
                  )}
                </div>
              );
            });
          })}
        </div>

        {/* Pieces Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {pieces.map((piece) => {
            const visualRow = isFlipped ? 7 - piece.row : piece.row;
            const visualCol = isFlipped ? 7 - piece.col : piece.col;

            return (
              <motion.div
                key={piece.id}
                initial={false}
                animate={{
                  x: `${visualCol * 100}%`,
                  y: `${visualRow * 100}%`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.8,
                }}
                className="absolute top-0 left-0 w-[12.5%] h-[12.5%] flex items-center justify-center pointer-events-none"
              >
                <img
                  src={Piece_Images[piece.color][piece.type]}
                  alt={`${piece.color} ${piece.type}`}
                  className="w-[90%] h-[90%] object-contain drop-shadow-xl select-none"
                  style={{
                    filter:
                      themeKey === "neotoon" && piece.color === "BLACK"
                        ? "sepia(1) saturate(5) hue-rotate(240deg) brightness(0.7)"
                        : themeKey === "neotoon" && piece.color === "WHITE"
                          ? "brightness(1.1) contrast(1.1)"
                          : "none",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Rank labels */}
        <div className="absolute -left-6 top-0 h-full flex flex-col justify-around text-[#C9CAD9] text-sm font-medium pointer-events-none">
          {displayRanks.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {/* File labels */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-around text-[#C9CAD9] text-sm font-medium pointer-events-none">
          {displayFiles.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
