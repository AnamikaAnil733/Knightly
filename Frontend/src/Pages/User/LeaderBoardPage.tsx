import React, { useEffect, useState } from "react";
import { getLeaderboard } from "../../Service/Api/ChessApi";
import { Trophy, User, TrendingUp } from "lucide-react";
import { Navbar } from "../../Components/User/Common/Navbar";

interface LeaderboardEntry {
  rank: number;
  displayname: string;
  avatarKey: string;
  rating: number;
}

export const LeaderBoardPage: React.FC = () => {
  const [activeType] = useState("bullet");
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(activeType);
        // Ensure data exists and map properly
        setPlayers(data || []);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeType]);

  const topThree = players.slice(0, 3);
  const remainingPlayers = players.slice(3);

  // Helper to get rank colors (matching reference image)
  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          border: "border-[#FFD700]",
          glow: "shadow-[0_0_20px_rgba(255,215,0,0.4)]",
          bg: "bg-[#FFD700]",
        };
      case 2:
        return {
          border: "border-[#3A6FF7]",
          glow: "shadow-[0_0_20px_rgba(58,111,247,0.4)]",
          bg: "bg-[#718096]",
        }; // Gray for #2 badge as in image
      case 3:
        return {
          border: "border-[#CD7F32]",
          glow: "shadow-[0_0_20px_rgba(205,127,50,0.4)]",
          bg: "bg-[#E2E8F0]/20",
        }; // placeholder
      default:
        return { border: "border-white/10", glow: "", bg: "bg-white/10" };
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1E] text-white font-['Poppins']">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FFD166] via-purple-400 to-[#FFD166] bg-clip-text text-transparent inline-block">
            Leaderboard
          </h1>
        </div>

        {/* Podium Section */}
        <div className="flex justify-center items-end gap-12 mb-20 pt-10">
          {/* 2nd Place */}
          {topThree[1] && (
            <div
              className="flex flex-col items-center animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative mb-6">
                <div
                  className={`w-32 h-32 rounded-full border-4 border-[#3A6FF7] ${getRankColors(2).glow} p-1 overflow-hidden bg-[#0A0F2C]`}
                >
                  {topThree[1].avatarKey ? (
                    <img
                      src={topThree[1].avatarKey}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full text-white/20">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#718096] flex items-center justify-center font-bold text-sm text-white border-2 border-[#070B1E]">
                  2
                </div>
              </div>
              <div className="bg-[#11193F]/60 backdrop-blur-md rounded-xl p-6 w-52 text-center border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold mb-1">
                  {topThree[1].displayname}
                </h3>
                <p className="text-white/40 text-sm font-medium">
                  Rating:{" "}
                  <span className="text-white">{topThree[1].rating}</span>
                </p>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center animate-fadeIn z-10">
              <div className="relative mb-8 pt-4">
                {/* Crown on top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Trophy
                    size={32}
                    className="text-[#FFD166] drop-shadow-[0_0_10px_rgba(255,209,102,0.5)]"
                  />
                </div>
                <div
                  className={`w-44 h-44 rounded-full border-4 border-[#FFD166] ${getRankColors(1).glow} p-1.5 overflow-hidden bg-[#0A0F2C]`}
                >
                  {topThree[0].avatarKey ? (
                    <img
                      src={topThree[0].avatarKey}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full text-[#FFD166]/20">
                      <User size={60} />
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4 transform translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFD166] flex items-center justify-center font-bold text-lg text-[#070B1E] border-2 border-[#070B1E]">
                  1
                </div>
              </div>
              <div className="bg-[#11193F]/80 backdrop-blur-md rounded-xl p-8 w-64 text-center border border-[#FFD166]/20 shadow-[0_0_30px_rgba(255,209,102,0.1)]">
                <h3 className="text-xl font-bold mb-2">
                  {topThree[0].displayname}
                </h3>
                <p className="text-[#FFD166]/60 text-lg font-bold">
                  Rating:{" "}
                  <span className="text-[#FFD166]">{topThree[0].rating}</span>
                </p>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div
              className="flex flex-col items-center animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="relative mb-6">
                <div
                  className={`w-32 h-32 rounded-full border-4 border-[#CD7F32] ${getRankColors(3).glow} p-1 overflow-hidden bg-[#0A0F2C]`}
                >
                  {topThree[2].avatarKey ? (
                    <img
                      src={topThree[2].avatarKey}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full text-white/20">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#CD7F32] flex items-center justify-center font-bold text-sm text-white border-2 border-[#070B1E]">
                  3
                </div>
              </div>
              <div className="bg-[#11193F]/60 backdrop-blur-md rounded-xl p-6 w-52 text-center border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold mb-1">
                  {topThree[2].displayname}
                </h3>
                <p className="text-white/40 text-sm font-medium">
                  Rating:{" "}
                  <span className="text-[#CD7F32]">{topThree[2].rating}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#FFD166] tracking-wide">
            Top Players of the Week
          </h2>
        </div>

        {/* Table Section */}
        <div className="bg-[#11193F]/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[#FFD166]/60 uppercase text-xs tracking-widest font-bold bg-white/2">
                <th className="px-10 py-6">Rank</th>
                <th className="px-10 py-6">Player</th>
                <th className="px-10 py-6">Rating</th>
                <th className="px-10 py-6">Country</th>
                <th className="px-10 py-6 text-center">Wins</th>
                <th className="px-10 py-6 text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {remainingPlayers.map((player, idx) => (
                <tr
                  key={player.rank}
                  className={`group hover:bg-white/5 transition-all duration-300 ${idx % 2 === 0 ? "bg-white/1" : ""}`}
                >
                  <td className="px-10 py-5">
                    <span className="font-bold text-[#3A6FF7] text-lg">
                      {player.rank}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0A0F2C] border border-white/10 overflow-hidden flex-shrink-0">
                        {player.avatarKey ? (
                          <img
                            src={player.avatarKey}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/20">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-white/90 group-hover:text-white transition-colors">
                        {player.displayname}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-5 font-medium text-white/80">
                    {player.rating}
                  </td>
                  <td className="px-10 py-5">
                    {/* Country Flags Placeholder */}
                    <div className="w-8 h-6 bg-white/5 rounded border border-white/10 flex items-center justify-center text-[10px] text-white/20">
                      FLAG
                    </div>
                  </td>
                  <td className="px-10 py-5 text-center font-medium text-white/80">
                    {Math.floor(Math.random() * 500) + 100}
                  </td>
                  <td className="px-10 py-5 text-right font-medium">
                    <div className="inline-flex items-center gap-2 text-[#3A6FF7]">
                      <TrendingUp size={14} className="animate-bounce" />
                      <span>{Math.floor(Math.random() * 10) + 1}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && players.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-[#FFD166] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white/40 tracking-widest text-sm uppercase">
                        Curating Legends...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && players.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <p className="text-white/20 tracking-widest text-xl font-bold uppercase">
                      No records found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
