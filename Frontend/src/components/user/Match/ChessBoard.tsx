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
  legalMoves?: { row: number; col: number,type?: "EN_PASSANT" | "NORMAL"  }[]
  onSquareClick?: (row: number, col: number) => void
  orientation?: "white" | "black"
}

export function Chessboard({
  board,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
  orientation = "white",
}: ChessboardProps) {

  // We want to render:
  // If WHITE: rows 0..7, cols 0..7
  // If BLACK: rows 7..0, cols 7..0  -> actually, usually visual board is 7 at top for White..
  // Wait.
  // Standard array: board[0] is row 0 (Top, usually Black pieces start here in standard representation if 0 is top)
  // Let's check initial board setup or usage.
  // In `MatchPage.tsx`:
  //    board[row][col]
  // Usually in chess engines:
  // Row 0, Col 0 is top-left (a8 in standard algebraic? Or a1?)
  
  // Let's assume standard visual:
  // If White: Top row is index 0. Bottom row is 7.
  // Users usually see White at bottom (rows 6,7) and Black at top (rows 0,1).
  // So for White view: Render row 0 at top, row 7 at bottom.
  // for Black view: Render row 7 at top, row 0 at bottom.

  // Let's verify existing rendering:
  // className="grid grid-cols-8 ..."
  // board.map((row, rowIndex) ...
  // This renders row 0, then row 1... down to row 7.
  // So Row 0 is at the Top.
  // If standard chess array:
  // Row 0 = Black Pieces (Rook Knight Bishop...)
  // Row 7 = White Pieces.
  
  // If White view:
  // We want Row 0 (Black) at Top. Row 7 (White) at Bottom.
  // Defaults valid.
  
  // If Black view:
  // We want Row 7 (White) at Top. Row 0 (Black) at Bottom.
  // So we need to reverse the outer array (rows) and inner array (cols) visually.

  const isFlipped = orientation === "black";

  // Helper to map visual index to actual board index
  const getVisualRow = (idx: number) => isFlipped ? 7 - idx : idx;
  const getVisualCol = (idx: number) => isFlipped ? 7 - idx : idx;

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;


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
             const row = board[actualRowIndex] || []; // Defensive, though board should be full

             return Array.from({ length: 8 }).map((_, displayColIndex) => {
                const actualColIndex = getVisualCol(displayColIndex);
                const cell = row[actualColIndex];

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

            {cell && (
                     <img
                       src={Piece_Images[cell.color][cell.type]}
                       alt={`${cell.color} ${cell.type}`}
                       className="w-[85%] h-[85%] object-contain pointer-events-none select-none drop-shadow-md"
                       draggable={false}
                     />
                   )}
              
                 </div>
               )
             });
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
  )
}
