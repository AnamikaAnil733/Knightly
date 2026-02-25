
import { PlayIcon } from 'lucide-react'
export function LiveMatches() {
  const matches = [
    {
      player1: 'GrandMaster_Alex',
      player2: 'QueenSlayer99',
      time: '12:34',
    },
    {
      player1: 'KnightRider_Pro',
      player2: 'CheckMate_King',
      time: '08:15',
    },
  ]
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Live Matches
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((match, index) => (
            <div
              key={index}
              className="bg-[#11193F]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#3A6FF7]/50 transition-all card-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlayIcon className="w-5 h-5 text-[#FFD166]" />
                  <span className="text-[#FFD166] font-semibold">LIVE</span>
                </div>
                <span className="text-[#C9CAD9]">{match.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{match.player1}</p>
                  <p className="text-[#C9CAD9] text-sm">White</p>
                </div>
                <span className="text-2xl text-[#FFD166]">VS</span>
                <div className="text-right">
                  <p className="text-white font-semibold">{match.player2}</p>
                  <p className="text-[#C9CAD9] text-sm">Black</p>
                </div>
              </div>
              <div className="mt-4 bg-[#0A0F2C] rounded-lg p-4 h-32 flex items-center justify-center">
                <span className="text-[#C9CAD9]">Chessboard Preview</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
