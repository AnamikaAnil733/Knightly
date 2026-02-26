import { Piece_Images } from "../../Reuseable/ChessPieces"
import { useMemo } from "react"

interface ChessboardPreviewProps {
  fen: string
}

const pieceMap = {
  p: Piece_Images.BLACK.PAWN,
  r: Piece_Images.BLACK.ROOK,
  n: Piece_Images.BLACK.KNIGHT,
  b: Piece_Images.BLACK.BISHOP,
  q: Piece_Images.BLACK.QUEEN,
  k: Piece_Images.BLACK.KING,
  P: Piece_Images.WHITE.PAWN,
  R: Piece_Images.WHITE.ROOK,
  N: Piece_Images.WHITE.KNIGHT,
  B: Piece_Images.WHITE.BISHOP,
  Q: Piece_Images.WHITE.QUEEN,
  K: Piece_Images.WHITE.KING,
} as const

export function ChessboardPreview({ fen }: ChessboardPreviewProps) {

  // Memoized FEN parsing
  const board = useMemo(() => {
    if (!fen) return []

    const rows = fen.split(" ")[0].split("/")

    return rows.map((row) => {
      const cells: (string | null)[] = []

      for (let i = 0; i < row.length; i++) {
        const char = row[i]

        if (Number.isNaN(Number(char))) {
          cells.push(pieceMap[char as keyof typeof pieceMap] ?? null)
        } else {
          const emptySquares = Number(char)
          for (let j = 0; j < emptySquares; j++) {
            cells.push(null)
          }
        }
      }

      return cells
    })
  }, [fen])

  return (
    <div className="w-full max-w-[320px] aspect-square mx-auto">
      <div className="grid grid-cols-8 grid-rows-8 h-full w-full border border-[#3A6FF7]/50 shadow-[0_0_15px_rgba(58,111,247,0.3)]">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`flex items-center justify-center
                ${(rowIndex + colIndex) % 2 === 0
                  ? "bg-[#6a92a5]"
                  : "bg-[#305375]"
                }`}
            >
              {piece && (
                <img
                  src={piece}
                  alt="chess-piece"
                  className="w-8 h-8 object-contain select-none pointer-events-none"
                  draggable={false}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}