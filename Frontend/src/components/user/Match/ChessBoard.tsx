import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Piece_Images } from "../../Reuseable/chessPieces"

type ChessColor = "WHITE" | "BLACK"

type ChessPiece = {
  type: "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING"
  color: ChessColor
  hasMoved: boolean
}

type ChessboardProps = {
  board: (ChessPiece | null)[][]
  selectedSquare?: { row: number; col: number } | null
  legalMoves?: { row: number; col: number, type?: "EN_PASSANT" | "NORMAL" }[]
  onSquareClick?: (row: number, col: number) => void
  orientation?: "white" | "black"
}

interface PositionedPiece extends ChessPiece {
  id: string;
  row: number;
  col: number;
}

export function Chessboard({
  board,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
  orientation = "white",
}: ChessboardProps) {

  const isFlipped = orientation === "black";


  const getVisualRow = (idx: number) => isFlipped ? 7 - idx : idx;
  const getVisualCol = (idx: number) => isFlipped ? 7 - idx : idx;

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // --- Piece Tracking Logic ---
  const [pieces, setPieces] = useState<PositionedPiece[]>([]);
  const prevBoardRef = useRef<(ChessPiece | null)[][] | null>(null);

  useEffect(() => {
    if (!board || board.length === 0) return;

    if (!prevBoardRef.current) {
      // Initialize pieces
      const initialPieces: PositionedPiece[] = [];
      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell) {
            initialPieces.push({
              ...cell,
              id: `${cell.color}-${cell.type}-${r}-${c}`,
              row: r,
              col: c
            });
          }
        });
      });
      setPieces(initialPieces);
      prevBoardRef.current = board;
      return;
    }

    // 1. Identify what moved
    // We'll simplify: if a piece of type T and color C moved from (r1, c1) to (r2, c2)
    // we find the piece in our current state that was at (r1, c1).
    
    // Create a temporary map of current pieces by their current position
    const pieceMap = new Map<string, PositionedPiece>();
    pieces.forEach(p => pieceMap.set(`${p.row}-${p.col}`, p));

    const updatedPieces: PositionedPiece[] = [];
    
    // We need to match pieces on the new board to pieces in our state
    // First, find exact matches (unmoved pieces)
    // Then find moved pieces
    // Then handle new pieces (promotions)
    
    const matchedFromNew = new Set<string>(); // "r-c" on new board
    const matchedFromOld = new Set<string>(); // id of piece in state

    // 1. Exact matches (same piece, same spot)
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const oldPiece = pieceMap.get(`${r}-${c}`);
        if (oldPiece && oldPiece.type === cell.type && oldPiece.color === cell.color) {
          updatedPieces.push({ ...oldPiece, ...cell, row: r, col: c });
          matchedFromNew.add(`${r}-${c}`);
          matchedFromOld.add(oldPiece.id);
        }
      });
    });

    // 2. Moved pieces
    // Find pieces that disappeared from old spots and appeared in new spots
    const disappeared = pieces.filter(p => !matchedFromOld.has(p.id));
    const appeared: {cell: ChessPiece, r: number, c: number}[] = [];
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && !matchedFromNew.has(`${r}-${c}`)) {
          appeared.push({ cell, r, c });
        }
      });
    });

    // Try to match disappeared to appeared
    // Simple heuristic: if only one piece of a type/color disappeared and one appeared, it's a move
    // For multiple (like multiple pawns), we can be less precise or use proximity
    appeared.forEach(app => {
      let foundMatch = false;
      for (let i = 0; i < disappeared.length; i++) {
        const dis = disappeared[i];
        if (dis.type === app.cell.type && dis.color === app.cell.color && !matchedFromOld.has(dis.id)) {
          updatedPieces.push({ ...dis, ...app.cell, row: app.r, col: app.c });
          matchedFromOld.add(dis.id);
          matchedFromNew.add(`${app.r}-${app.c}`);
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
         // It's a brand new piece (e.g. promotion) or we couldn't match it
         const newId = `${app.cell.color}-${app.cell.type}-${app.r}-${app.c}-${Date.now()}`;
         updatedPieces.push({ ...app.cell, id: newId, row: app.r, col: app.c });
         matchedFromNew.add(`${app.r}-${app.c}`);
      }
    });

    setPieces(updatedPieces);
    prevBoardRef.current = board;
  }, [board]);


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
          {/* We iterate 0..7 for display rows */}
          {Array.from({ length: 8 }).map((_, displayRowIndex) => {
             const actualRowIndex = getVisualRow(displayRowIndex);

             return Array.from({ length: 8 }).map((_, displayColIndex) => {
                const actualColIndex = getVisualCol(displayColIndex);

                const isLight = (actualRowIndex + actualColIndex) % 2 === 0;
                
                const isSelected =
                  selectedSquare?.row === actualRowIndex &&
                  selectedSquare?.col === actualColIndex;

                const isLegalMove = legalMoves.some(
                  (m) => m.row === actualRowIndex && m.col === actualColIndex
                );

                const isEnPassant = legalMoves.some(
                  (m) =>
                    m.row === actualRowIndex &&
                    m.col === actualColIndex &&
                    m.type === "EN_PASSANT"
                );

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
                   ${isLight ? "bg-[#F2F7F9]" : "bg-[#4FB3BF]"}
                   ${isSelected ? "ring-4 ring-[#6d5bae] ring-inset" : ""}
                   ${isLegalMove
                     ? isEnPassant
                       ? "after:absolute after:w-5 after:h-5 after:border-2 after:bg-[#394f64] after:rounded-full after:pointer-events-none"
                       : "after:absolute after:w-4 after:h-4 after:bg-[#394f64]/80 after:rounded-full after:pointer-events-none"
                     : ""}
                   
                 `}

                   style={{
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
              <span className={`absolute top-0.5 left-0.5 text-[10px] sm:text-xs font-bold leading-none select-none ${isLight ? "text-[#4FB3BF]" : "text-[#F2F7F9]"}`}>
                {displayRanks[displayRowIndex]}
              </span>
            )}

            {/* File Letters (a-h) - Bottom Right of last row */}
            {displayRowIndex === 7 && (
              <span className={`absolute bottom-0.5 right-0.5 text-[10px] sm:text-xs font-bold leading-none select-none ${isLight ? "text-[#4FB3BF]" : "text-[#F2F7F9]"}`}>
                {displayFiles[displayColIndex]}
              </span>
            )}
              
                 </div>
               )
             });
          })}
        </div>

        {/* Pieces Layer - Animate pieces across the board */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {pieces.map((piece) => {
              const visualRow = isFlipped ? 7 - piece.row : piece.row;
              const visualCol = isFlipped ? 7 - piece.col : piece.col;

              return (
                <motion.div
                  key={piece.id}
                  layoutId={piece.id}
                  initial={false}
                  animate={{
                    x: `${visualCol * 100}%`,
                    y: `${visualRow * 100}%`,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                  className="absolute top-0 left-0 w-[12.5%] h-[12.5%] flex items-center justify-center pointer-events-none"
                >
                  <motion.img
                    src={Piece_Images[piece.color][piece.type]}
                    alt={`${piece.color} ${piece.type}`}
                    className="w-[90%] h-[90%] object-contain drop-shadow-xl select-none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
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
  )
}
