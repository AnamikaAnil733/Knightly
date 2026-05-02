import { useEffect, useState } from "react";
import { getGameHistory } from "../../Service/Api/ChessApi";
import { ChevronRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import { GameHistoryEntry } from "../../Types/MatchTypes";

export function GameHistoryList() {
  const currentUser = useSelector((state: RootState) => state.userAuth.user);
  const [games, setGames] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getGameHistory();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch game history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-white/5 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
          No matches found
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {games.map((game: GameHistoryEntry) => {
        const isWhite = game.whitePlayer.id === currentUser?.id;
        const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
        const ratingChange = isWhite
          ? game.whiteRatingChange
          : game.blackRatingChange;

        const result =
          game.status.includes("TIMEOUT") ||
          game.status.includes("RESIGNED") ||
          game.status === "CHECKMATE"
            ? isWhite &&
              (game.status.startsWith("BLACK") || game.status === "CHECKMATE")
              ? "Win"
              : "Loss"
            : "Draw";

        return (
          <div
            key={game.id}
            className="px-8 py-5 hover:bg-white/[0.02] transition-colors group flex items-center justify-between"
          >
            {/* OPPONENT */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD166]/20 transition-all">
                <User className="w-5 h-5 text-gray-500 group-hover:text-[#FFD166]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                  {opponent.displayname}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  {game.timeControl}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="flex items-center gap-12">
              <span
                className={`w-16 text-center text-[10px] font-black uppercase tracking-widest py-1 rounded-md ${
                  result === "Win"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : result === "Loss"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-gray-500/10 text-gray-500"
                }`}
              >
                {result}
              </span>

              <span
                className={`w-12 text-center text-sm font-black ${ratingChange && ratingChange > 0 ? "text-emerald-500" : "text-[#FFD166]"}`}
              >
                {ratingChange
                  ? ratingChange > 0
                    ? `+${ratingChange}`
                    : ratingChange
                  : "0"}
              </span>

              <div className="hidden md:block w-20 text-right">
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(game.createdAt))}
                </p>
              </div>

              <Link
                to={`/review/${game.id}`}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-[#FFD166] transition-all"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
