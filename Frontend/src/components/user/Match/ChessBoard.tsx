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
  legalMoves?: { row: number; col: number }[]
  onSquareClick?: (row: number, col: number) => void
}



export function Chessboard({
  board,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
}: ChessboardProps) {
  return (
    <div className="relative">
      {/* Glowing frame */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] blur-xl opacity-30 pointer-events-none" />


      {/* Board container */}
      <div
        className="relative rounded-lg overflow-hidden border-2 border-[#3A6FF7]/50 shadow-2xl"
        style={{
          boxShadow:
            "0 0 40px rgba(106, 126, 176, 0.3), 0 0 80px rgba(107, 46, 255, 0.2)",
        }}
      >
        {/* 8x8 grid */}
        <div className="grid grid-cols-8 w-[560px] h-[560px]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected =
                selectedSquare?.row === rowIndex &&
                selectedSquare?.col === colIndex

              const isLegalMove = legalMoves.some(
                (m) => m.row === rowIndex && m.col === colIndex
              )

              

              return (
                <div
                key={`${rowIndex}-${colIndex}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onSquareClick?.(rowIndex, colIndex);
                }}
                className={`
                  relative
                  w-[70px] h-[70px]
                  flex items-center justify-center
                  cursor-pointer select-none
                  transition-all duration-200
                  ${isLight ? "bg-[#F2F7F9]" : "bg-[#4FB3BF]"}
                  ${isSelected ? "ring-4 ring-[#FFD166] ring-inset" : ""}
                  ${isLegalMove
                    ? "after:absolute after:w-4 after:h-4 after:bg-[#FFD166]/80 after:rounded-full after:pointer-events-none"
                    : ""}
                `}

                  style={{
                    borderRight:
                      colIndex < 7
                        ? "1px solid rgba(255, 209, 102, 0.1)"
                        : "none",
                    borderBottom:
                      rowIndex < 7
                        ? "1px solid rgba(255, 209, 102, 0.1)"
                        : "none",
                  }}
                >
                        {cell && (
                    <img
                      src={Piece_Images[cell.color][cell.type]}
                      alt={`${cell.color} ${cell.type}`}
                      className="w-12 h-12 pointer-events-none select-none"
                      draggable={false}
                    />
                  )}
             
                </div>
              )
            })
          )}
        </div>

        {/* Rank labels */}
        <div className="absolute -left-6 top-0 h-full flex flex-col justify-around text-[#C9CAD9] text-sm font-medium pointer-events-none">

          {["8", "7", "6", "5", "4", "3", "2", "1"].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {/* File labels */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-around text-[#C9CAD9] text-sm font-medium pointer-events-none">

          {["a", "b", "c", "d", "e", "f", "g", "h"].map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
