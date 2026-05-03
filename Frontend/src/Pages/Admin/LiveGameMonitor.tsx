import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gamepad2, Users, Clock, Eye, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";
import { LiveGames } from "../../Types/LiveTypes";

export function LiveGameMonitor() {
  const navigate = useNavigate();
  const [initialDate] = useState(new Date());

  const {
    data: games,
    isLoading,
    isError,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useQuery<LiveGames[]>({
    queryKey: ["admin-live-games"],
    queryFn: async () => {
      const res = await axios.get("/admin/live-games");
      // Handle both [games] and { success: true, data: [games] } formats
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    },
    refetchInterval: 10000,
  });

  const lastRefreshed = dataUpdatedAt ? new Date(dataUpdatedAt) : initialDate;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load live games");
    }
  }, [isError]);

  return (
    <div className="w-full min-h-screen p-6 bg-[#0A0F2C]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFD166]/10 rounded-lg">
              <Gamepad2 className="h-8 w-8 text-[#FFD166]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Live Game Monitor
              </h1>
              <p className="text-gray-400 text-sm">
                Real-time overview of all ongoing matches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Last Updated
              </p>
              <p className="text-sm text-gray-300">
                {lastRefreshed.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 bg-[#11193F] border border-[#1e2547] rounded-lg text-white hover:bg-[#1e2547] transition-all disabled:opacity-50"
            >
              <RefreshCcw
                className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* STATS BREADCRUMB */}
        <div className="flex gap-4 mb-8">
          <div className="px-4 py-2 bg-[#11193F] rounded-full border border-[#FFD166]/20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-white text-sm font-medium">
              {games?.length || 0} Active Games
            </span>
          </div>
        </div>

        {/* GAMES GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-[#11193F]/50 rounded-2xl animate-pulse border border-[#1e2547]"
              ></div>
            ))}
          </div>
        ) : games?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#11193F]/20 rounded-3xl border border-dashed border-[#1e2547]">
            <Users className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">
              No active games right now
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              Check back when players are online
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games?.map((game) => (
              <div
                key={game.id}
                className="bg-[#11193F] rounded-2xl border border-[#1e2547] hover:border-[#FFD166]/40 transition-all group overflow-hidden flex flex-col"
              >
                {/* CARD CONTENT */}
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-2 py-1 bg-black/40 rounded text-[10px] font-bold text-[#FFD166] border border-[#FFD166]/20">
                      {game.timeControl}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      Started{" "}
                      {game.createdAt
                        ? new Date(game.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* WHITE PLAYER */}
                    <div className="flex flex-col items-center flex-1 text-center">
                      <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 mb-2 p-1">
                        <img
                          src={
                            game.whitePlayer.avatar ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${game.whitePlayer.name}`
                          }
                          className="h-full w-full object-contain"
                          alt="avatar"
                        />
                      </div>
                      <p className="text-white font-bold text-sm truncate w-full">
                        {game.whitePlayer.name}
                      </p>
                      <p className="text-[#FFD166] text-xs font-medium">
                        {game.whitePlayer.rating}
                      </p>
                    </div>

                    <div className="text-gray-600 font-bold italic">VS</div>

                    {/* BLACK PLAYER */}
                    <div className="flex flex-col items-center flex-1 text-center">
                      <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 mb-2 p-1">
                        <img
                          src={
                            game.blackPlayer.avatar ||
                            `https://api.dicebear.com/7.x/bottts/svg?seed=${game.blackPlayer.name}`
                          }
                          className="h-full w-full object-contain"
                          alt="avatar"
                        />
                      </div>
                      <p className="text-white font-bold text-sm truncate w-full">
                        {game.blackPlayer.name}
                      </p>
                      <p className="text-[#FFD166] text-xs font-medium">
                        {game.blackPlayer.rating}
                      </p>
                    </div>
                  </div>
                </div>

                {/* WATCH BUTTON */}
                <button
                  onClick={() => navigate(`/match/${game.id}?monitor=true`)}
                  className="w-full py-4 bg-[#1e2547] group-hover:bg-[#FFD166] flex items-center justify-center gap-2 transition-all"
                >
                  <Eye className="h-4 w-4 text-[#FFD166] group-hover:text-black" />
                  <span className="text-sm font-bold text-white group-hover:text-black">
                    Watch Live
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
