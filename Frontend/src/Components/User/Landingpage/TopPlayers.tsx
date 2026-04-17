import { useEffect, useState } from "react";
import { CrownIcon, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../../../Service/Api/ChessApi";
import { LeaderboardEntry } from "../../../Types/LeaderBoardTypes";

export function TopPlayers() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const data = await getLeaderboard("blitz");
        if (data && Array.isArray(data)) {
          const rankColors = ["#4F7CFF", "#AAB3D1", "#6D5DF6", "#2E3A8C"];
          console.log(data[0]);

          const formattedPlayers = data
            .slice(0, 4)
            .map((p: LeaderboardEntry, index: number) => ({
              displayname: p.displayname,
              rating: p.rating,
              averageRating: p.rating,
              rank: p.rank,
              avatarKey: p.avatarKey,
              premium: p.premium,
              color: rankColors[index] || "#2E3A8C",
            }));
          setPlayers(formattedPlayers);
        }
      } catch (error) {
        console.error("Failed to fetch top players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-64 bg-white/10 rounded mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#1C254E]/50 rounded-2xl p-6 border border-white/10 h-64"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (players.length === 0) return null;

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
          {players.map((player: LeaderboardEntry) => (
            <div
              key={player.rank}
              className="bg-[#1C254E]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#4F7CFF]/50 transition-all card-glow text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#6D5DF6] mx-auto mb-4 flex items-center justify-center relative">
                {player.avatarKey ? (
                  <img
                    src={player.avatarKey}
                    alt={player.displayname}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <CrownIcon className="w-10 h-10 text-white" />
                )}
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
              <h3 className="text-white font-semibold mb-2 flex items-center justify-center gap-1">
                {player.displayname}
                {player.premium && (
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                )}
              </h3>
              <p className="text-[#4F7CFF] text-2xl font-bold mb-1">
                {player.averageRating}
              </p>
              <p className="text-[#AAB3D1] text-sm font-medium tracking-wide">
                Avg. Rating
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/leaderboard")}
            className="px-8 py-3 rounded-full border-2 border-[#4F7CFF] text-[#4F7CFF] font-semibold hover:bg-[#4F7CFF]/10 transition-all"
          >
            View Full Leaderboard
          </button>
        </div>
      </div>
    </section>
  );
}
