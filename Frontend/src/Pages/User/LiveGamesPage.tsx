import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Clock, Search, Ghost } from "lucide-react";
import { getLiveGames } from "../../Service/Api/ChessApi";
import { LiveGame } from "../../Types/LiveTypes";

export function LiveGamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGames = async () => {
    try {
      const data = await getLiveGames();
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch live games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredGames = games.filter((game) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      game.id.toLowerCase().includes(searchLower) ||
      game.whitePlayerId?.toLowerCase().includes(searchLower) ||
      game.blackPlayerId?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white pt-24 pb-12 px-6 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-[#FFD166] bg-clip-text text-transparent font-['Poppins'] mb-2"
            >
              Live Matches
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#C9CAD9] text-lg"
            >
              Watch the action unfold in real-time.
            </motion.p>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9CAD9]/40 group-focus-within:text-[#3A6FF7] transition-colors" />
            <input
              type="text"
              placeholder="Search by player or game ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-[#3A6FF7]/50 focus:outline-none focus:ring-4 ring-[#3A6FF7]/10 transition-all font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-[#3A6FF7]/20 border-t-[#3A6FF7] rounded-full animate-spin" />
            <p className="text-[#C9CAD9] animate-pulse">
              Scanning the arena for active battles...
            </p>
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] rounded-3xl blur-[12px] opacity-0 group-hover:opacity-20 transition-opacity" />

                <div className="relative p-8 rounded-3xl bg-[#11193F]/60 backdrop-blur-xl border border-white/5 group-hover:border-[#3A6FF7]/30 transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF476F]/10 border border-[#EF476F]/20">
                      <div className="w-2 h-2 rounded-full bg-[#EF476F] animate-pulse" />
                      <span className="text-[#EF476F] text-[10px] font-bold uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#C9CAD9]/60 text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{game.timeControl}</span>
                    </div>
                  </div>

                  {/* Players Section */}
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                          ⚪
                        </div>
                        <div>
                          <p className="text-white font-bold truncate max-w-[120px]">
                            {game.whitePlayerId === "stockfish-bot"
                              ? "Stockfish AI"
                              : game.whitePlayerId || "Anonymous"}
                          </p>
                          <p className="text-[#C9CAD9]/40 text-[10px] font-bold uppercase">
                            White
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FFD166] font-bold text-sm">
                          Active
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-2 relative">
                      <div className="h-[1px] w-full bg-white/5 absolute" />
                      <div className="relative z-10 bg-[#11193F] px-4 text-[10px] font-black italic text-white/20">
                        VS
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                          ⚫
                        </div>
                        <div>
                          <p className="text-white font-bold truncate max-w-[120px]">
                            {game.blackPlayerId === "stockfish-bot"
                              ? "Stockfish AI"
                              : game.blackPlayerId || "Anonymous"}
                          </p>
                          <p className="text-[#C9CAD9]/40 text-[10px] font-bold uppercase">
                            Black
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#3A6FF7] font-bold text-sm">
                          Active
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/match/${game.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-[#3A6FF7] hover:border-[#3A6FF7] transition-all group/btn"
                  >
                    <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                    Watch Match
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8">
              <Ghost className="w-12 h-12 text-[#C9CAD9]/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              No public battles active
            </h3>
            <p className="text-[#C9CAD9] max-w-xs mx-auto mb-8">
              Looks like everyone is playing in the shadows. Why not start a
              public game yourself?
            </p>
            <button
              onClick={() => navigate("/play")}
              className="px-8 py-3 rounded-xl bg-[#3A6FF7] text-white font-bold shadow-lg shadow-[#3A6FF7]/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              Start Game
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
