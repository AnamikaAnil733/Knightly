
interface ChessboardPreviewProps {
  fen: string
}
export function ChessboardPreview({ fen }: ChessboardPreviewProps) {
  // Simple FEN parser to render a basic chessboard
  const rows = fen.split(' ')[0].split('/')
  // Map piece characters to symbols
  const pieceMap: Record<string, string> = {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
    P: '♙',
    R: '♖',
    N: '♘',
    B: '♗',
    Q: '♕',
    K: '♔',
  }
  // Process FEN string to create board representation
  const board = rows.map((row) => {
    const cells = []
    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (isNaN(parseInt(char))) {
        cells.push(pieceMap[char])
      } else {
        for (let j = 0; j < parseInt(char); j++) {
          cells.push('')
        }
      }
    }
    return cells
  })
  return (
    <div className="w-full max-w-[320px] aspect-square mx-auto">
      <div className="grid grid-cols-8 grid-rows-8 h-full w-full border border-[#3A6FF7]/50 shadow-[0_0_15px_rgba(58,111,247,0.3)]">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`flex items-center justify-center text-2xl
                ${(rowIndex + colIndex) % 2 === 0 ? 'bg-[#11193F]' : 'bg-[#0A0F2C]'}`}
            >
              <span
                className={
                  piece.match(/[A-Z]/) ? 'text-white' : 'text-[#FFD166]'
                }
              >
                {piece}
              </span>
            </div>
          )),
        )}
      </div>
    </div>
  )
}
