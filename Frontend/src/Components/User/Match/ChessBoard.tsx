import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Piece_Images } from "../../Reuseable/ChessPieces";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { BOARD_THEMES } from "./BoardThemes";
import { ChessPiece } from "../../../Types/ChessTypes";

type ChessboardProps = {
  board: (ChessPiece | null)[][];
  selectedSquare?: { row: number; col: number } | null;
  legalMoves?: { row: number; col: number; type?: "EN_PASSANT" | "NORMAL" }[];
  onSquareClick?: (row: number, col: number) => void;
  orientation?: "white" | "black";
  hintSquare?: { row: number; col: number } | null;
  lastMove?: {
    from: { row: number; col: number };
    to: { row: number; col: number };
  } | null;
  checkSquare?: { row: number; col: number } | null;
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
  lastMove = null,
  checkSquare = null,
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
    <div className="relative w-full max-w-[min(800px,100%)] p-4 sm:p-6 lg:p-8 aspect-square mx-auto flex items-center justify-center">
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

              const isLastMove =
                (lastMove?.from.row === actualRowIndex &&
                  lastMove?.from.col === actualColIndex) ||
                (lastMove?.to.row === actualRowIndex &&
                  lastMove?.to.col === actualColIndex);

              const isCheck =
                checkSquare?.row === actualRowIndex &&
                checkSquare?.col === actualColIndex;

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
                   ${isSelected ? "ring-2 ring-inset ring-white/50" : ""}
                 `}
                  style={{
                    backgroundColor: isSelected
                      ? theme.selected
                      : isHinted
                        ? "rgba(58, 111, 247, 0.4)"
                        : isLight
                          ? theme.light
                          : theme.dark,
                    borderColor: isSelected
                      ? "rgba(255,255,255,0.4)"
                      : "transparent",
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
                  {/* Modern Legal Move Indicators */}
                  {isLegalMove && (
                    <div
                      className={`absolute z-20 rounded-full pointer-events-none transition-all duration-300 ${
                        board[actualRowIndex][actualColIndex] || isEnPassant
                          ? "w-[90%] h-[90%] border-[6px] border-black/20"
                          : "w-5 h-5 bg-black/25"
                      }`}
                    />
                  )}

                  {/* Modern Check Highlight with Pulse */}
                  {isCheck && (
                    <motion.div
                      initial={{ opacity: 0.6, scale: 0.95 }}
                      animate={{
                        opacity: [0.6, 0.9, 0.6],
                        scale: [0.95, 1, 0.95],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 z-0 bg-gradient-to-br from-red-500/80 to-red-900/60 shadow-[inset_0_0_30px_rgba(239,68,68,1)] border-2 border-red-500/50"
                    />
                  )}

                  {/* Modern Last Move Highlight */}
                  {isLastMove && !isCheck && !isSelected && (
                    <div className="absolute inset-0 z-0 bg-yellow-400/40 shadow-[inset_0_0_20px_rgba(250,204,21,0.5)] border-2 border-yellow-400/30" />
                  )}

                  {/* Rank Numbers (1-8) - Top Left of first col */}
                  {displayColIndex === 0 && (
                    <span
                      className={`absolute top-0.5 left-0.5 text-[6px] xs:text-[8px] sm:text-[10px] lg:text-[12px] font-bold leading-none select-none z-10`}
                      style={{ color: isLight ? theme.dark : theme.light }}
                    >
                      {displayRanks[displayRowIndex]}
                    </span>
                  )}

                  {/* File Letters (a-h) - Bottom Right of last row */}
                  {displayRowIndex === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-0.5 text-[6px] xs:text-[8px] sm:text-[10px] lg:text-[12px] font-bold leading-none select-none z-10`}
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

        {/* Rank labels (Inside Padding) */}
        <div className="absolute left-0.5 sm:left-1 top-4 sm:top-6 bottom-4 sm:bottom-6 flex flex-col justify-around text-[#C9CAD9] text-[9px] sm:text-xs lg:text-sm font-medium pointer-events-none">
          {displayRanks.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {/* File labels (Inside Padding) */}
        <div className="absolute bottom-0.5 sm:bottom-1 left-4 sm:left-6 right-4 sm:right-6 flex justify-around text-[#C9CAD9] text-[9px] sm:text-xs lg:text-sm font-medium pointer-events-none">
          {displayFiles.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
