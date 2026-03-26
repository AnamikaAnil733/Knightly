import { useEffect, useState } from "react";
import { getGameHistory } from "../../Service/Api/ChessApi";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Types/User";

interface GameHistoryEntry {
  id: string;
  whitePlayer: {
    id: string;
    displayname: string;
    avatarUrl: string | null;
  };
  blackPlayer: {
    id: string;
    displayname: string;
    avatarUrl: string | null;
  };
  status: string;
  createdAt: string;
  timeControl: string;
  whiteRatingChange?: number;
  blackRatingChange?: number;
}

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
      <div className="mt-12 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-navy-card rounded mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-navy-card rounded-xl border border-blue-electric/10"
          ></div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="mt-12 text-center py-12 bg-navy-card rounded-2xl border border-dashed border-gray-600">
        <p className="text-gray-400">
          No games played yet. Start a match to see your history!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-8 text-gold uppercase tracking-wider">
        Recent Matches
      </h2>

      <div className="space-y-4">
        {games.map((game: GameHistoryEntry) => {
          const isWhite = game.whitePlayer.id === currentUser?.id;
          const opponent = isWhite ? game.blackPlayer : game.whitePlayer;
          const ratingChange = isWhite
            ? game.whiteRatingChange
            : game.blackRatingChange;

          // Simplified win/loss detection for UI based on common status strings
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
              className="bg-navy-card/50 rounded-xl p-4 border border-white/5 hover:bg-navy-card transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                {/* OPPONENT INFO */}
                <div className="flex items-center gap-4 flex-1">
                  {/* <div className="relative">
                    {opponent.avatarUrl ? (
                      <img
                        src={opponent.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-full ring-2 ring-purple-accent/30 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-navy-dark flex items-center justify-center ring-2 ring-white/10">
                        <User className="w-6 h-6 text-white/30" />
                      </div>
                    )}
                  </div> */}
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
                      {opponent.displayname}
                    </h3>
                  </div>
                </div>

                {/* GAME STATS */}
                <div className="flex items-center gap-4 sm:gap-8">
                  {/* RESULT BADGE */}
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${
                      result === "Win"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : result === "Loss"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {result}
                  </span>

                  {/* RATING CHANGE */}
                  <span className="text-gold font-bold w-12 text-center">
                    {ratingChange
                      ? ratingChange > 0
                        ? `+${ratingChange}`
                        : ratingChange
                      : "0"}
                  </span>

                  {/* MODE & DATE */}
                  <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
                    <span className="w-24 text-right italic">
                      {game.timeControl}
                    </span>
                    <span className="w-20">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(game.createdAt))}
                    </span>
                  </div>

                  <Link
                    to={`/review/${game.id}`}
                    className="p-2 hover:bg-gold/10 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
