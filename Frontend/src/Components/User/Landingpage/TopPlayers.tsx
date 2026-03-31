import { CrownIcon } from "lucide-react";
export function TopPlayers() {
  const players = [
    {
      name: "Magnus_Supreme",
      rating: 2850,
      rank: 1,
      color: "#4F7CFF",
    },
    {
      name: "Hikaru_Lightning",
      rating: 2820,
      rank: 2,
      color: "#AAB3D1",
    },
    {
      name: "Chess_Goddess",
      rating: 2800,
      rank: 3,
      color: "#6D5DF6",
    },
    {
      name: "Tactical_Genius",
      rating: 2780,
      rank: 4,
      color: "#2E3A8C",
    },
  ];
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Top Players This Week
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {players.map((player) => (
            <div
              key={player.rank}
              className="bg-[#1C254E]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#4F7CFF]/50 transition-all card-glow text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#6D5DF6] mx-auto mb-4 flex items-center justify-center relative">
                <CrownIcon className="w-10 h-10 text-white" />
                {player.rank <= 3 && (
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: player.color,
                    }}
                  >
                    <span className="text-white font-bold text-sm">
                      {player.rank}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-2">{player.name}</h3>
              <p className="text-[#4F7CFF] text-2xl font-bold mb-1">
                {player.rating}
              </p>
              <p className="text-[#AAB3D1] text-sm">Rating</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-8 py-3 rounded-full border-2 border-[#4F7CFF] text-[#4F7CFF] font-semibold hover:bg-[#4F7CFF]/10 transition-all">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </section>
  );
}
