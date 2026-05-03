import { useEffect, useState } from "react";
import { ArrowRight, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLiveGames } from "../../../Service/Api/ChessApi";
import { Match } from "../../../Types/LiveTypes";

export function LiveMatches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getLiveGames();
        // Show only top 2 matches on landing page
        setMatches(data.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch live matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && matches.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4F7CFF]/20 border-t-[#4F7CFF] rounded-full animate-spin mb-4" />
        <p className="text-[#AAB3D1]">Seeking active battles...</p>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Decorative backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#4F7CFF]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="text-center md:text-left">
            <h2
              className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Live Matches
            </h2>
            <p className="text-[#AAB3D1] max-w-lg text-lg">
              Watch top players clash in real-time. Join as a spectator and
              learn from the masters.
            </p>
          </div>
          <button
            onClick={() => navigate("/live")}
            className="group flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-[#4F7CFF] hover:border-[#4F7CFF] transition-all"
          >
            View Arena
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {matches.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {matches.map((match, index) => (
              <div
                key={match.id || index}
                onClick={() => navigate(`/match/${match.id}`)}
                className="group cursor-pointer bg-[#1C254E]/40 backdrop-blur-md rounded-[32px] p-8 border border-white/5 hover:border-[#4F7CFF]/30 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#EF476F]/10 border border-[#EF476F]/20">
                    <div className="w-2 h-2 rounded-full bg-[#EF476F] animate-pulse" />
                    <span className="text-[#EF476F] text-[10px] font-black tracking-widest uppercase">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#AAB3D1] text-xs font-bold uppercase tracking-wider bg-white/5 px-4 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    {match.timeControl}
                  </div>
                </div>

                {/* Rivalry Section */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-black text-xl mb-1 truncate">
                      {match.whitePlayer.id === "stockfish-bot"
                        ? "Stockfish AI"
                        : match.whitePlayer.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <span className="text-[#AAB3D1] text-[10px] font-bold uppercase tracking-widest">
                        White
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black italic text-[#4F7CFF]/50 select-none">
                      VS
                    </span>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-white font-black text-xl mb-1 truncate">
                      {match.blackPlayer.id === "stockfish-bot"
                        ? "Stockfish AI"
                        : match.blackPlayer.name || "Anonymous"}
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-[#AAB3D1] text-[10px] font-bold uppercase tracking-widest">
                        Black
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#0B1437]" />
                    </div>
                  </div>
                </div>

                {/* Match Preview Card */}
                <div className="mt-8 bg-[#0B1437]/60 rounded-2xl p-6 h-40 flex flex-col items-center justify-center border border-white/5 group-hover:bg-[#4F7CFF]/5 transition-colors">
                  <Trophy className="w-10 h-10 text-[#4F7CFF]/30 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[#AAB3D1] text-sm font-medium">
                    Click to Spectate Battle
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[32px] py-32 flex flex-col items-center justify-center text-center px-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Arena is Quiet
            </h3>
            <p className="text-[#AAB3D1] max-w-sm mb-8">
              There are currently no public matches in progress. Start one and
              broadcast it here!
            </p>
            <button
              onClick={() => navigate("/play")}
              className="px-8 py-4 bg-[#4F7CFF] text-white rounded-2xl font-black tracking-wide hover:shadow-[0_0_30px_rgba(79,124,255,0.4)] transition-all"
            >
              Start Public Match
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
