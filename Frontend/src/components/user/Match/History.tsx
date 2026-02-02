
const moves = [
  {
    number: 1,
    white: 'e4',
    black: 'e5',
  },
  {
    number: 2,
    white: 'Nf3',
    black: 'Nc6',
  },
  {
    number: 3,
    white: 'd4',
    black: 'exd4',
  },
  {
    number: 4,
    white: 'Nxd4',
    black: 'Nf6',
  },
  {
    number: 5,
    white: 'Nc3',
    black: 'Bb4',
  },
  {
    number: 6,
    white: 'Nxc6',
    black: 'bxc6',
  },
  {
    number: 7,
    white: 'Bd3',
    black: 'd5',
  },
  {
    number: 8,
    white: 'exd5',
    black: 'cxd5',
  },
  {
    number: 9,
    white: 'O-O',
    black: 'O-O',
  },
  {
    number: 10,
    white: 'Bg5',
    black: 'c6',
  },
  {
    number: 11,
    white: 'Qf3',
    black: 'Be7',
  },
  {
    number: 12,
    white: 'Rfe1',
    black: '',
  },
]
export function MoveList() {
  return (
    <div
      className="w-64 rounded-xl backdrop-blur-md bg-[#11193F]/70 border border-[#3A6FF7]/30 p-6 h-[700px] flex flex-col"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h3
        className="text-white font-semibold text-lg mb-4 pb-3 border-b border-[#FFD166]/20"
        style={{
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Move List
      </h3>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {moves.map((move, index) => (
          <div
            key={move.number}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg
              ${index === moves.length - 1 ? 'bg-[#FFD166]/20 text-[#FFD166]' : 'text-[#C9CAD9] hover:bg-[#1C2445]/50'}
              cursor-pointer transition-colors
            `}
            style={{
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <span className="text-sm font-medium w-6">{move.number}.</span>
            <span className="flex-1 text-sm">{move.white}</span>
            <span className="flex-1 text-sm">{move.black}</span>
          </div>
        ))}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(28, 36, 69, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 209, 102, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 209, 102, 0.5);
        }
      `}</style>
    </div>
  )
}
