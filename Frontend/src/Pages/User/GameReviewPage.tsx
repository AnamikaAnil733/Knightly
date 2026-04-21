import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import { Chessboard } from "../../Components/User/Match/ChessBoard";
import { getGame, getGameReview } from "../../Service/Api/ChessApi";
import { fenToBoardGrid, movesToFens } from "../../Utils/ChessUtils";
import { BoardGrid, MoveDTO, AnalysisData } from "../../Types/Chess";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Lock,
  Crown,
} from "lucide-react";

export function GameReviewPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [board, setBoard] = useState<BoardGrid>([]);
  const [fens, setFens] = useState<string[]>([]);
  const [reviewData, setReviewData] = useState<AnalysisData[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveDTO[]>([]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [whitePlayer, setWhitePlayer] = useState<{
    name: string;
    rating: number;
    avatar: string | null;
  } | null>(null);
  const [blackPlayer, setBlackPlayer] = useState<{
    name: string;
    rating: number;
    avatar: string | null;
  } | null>(null);

  const getStats = () => {
    if (reviewData.length === 0) return null;
    const counts: Record<string, number> = {
      BLUNDER: 0,
      MISTAKE: 0,
      INACCURACY: 0,
      GOOD: 0,
      EXCELLENT: 0,
      BEST: 0,
      BOOK: 0,
      BRILLIANT: 0,
      GREAT: 0,
    };
    reviewData.forEach((d) => {
      if (counts[d.classification] !== undefined) counts[d.classification]++;
    });

    const accuracy =
      (counts.BEST +
        counts.BRILLIANT +
        counts.GREAT +
        counts.EXCELLENT +
        counts.BOOK +
        counts.GOOD * 0.8) /
      reviewData.length;

    return { counts, accuracy: Math.round(accuracy * 100) };
  };

  const stats = getStats();

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;
      try {
        setLoading(true);
        const game = await getGame(gameId);
        const generatedFens = movesToFens(game.history);
        setFens(generatedFens);
        setMoveHistory(game.history);

        // Start at the beginning
        setCurrentMoveIndex(0);
        setBoard(fenToBoardGrid(generatedFens[0]));
        setWhitePlayer(game.whitePlayer);
        setBlackPlayer(game.blackPlayer);
        setLoading(false);

        // Fetch analysis in background
        if (user?.premium) {
          setAnalysisLoading(true);
          try {
            const reviewAnalysis = await getGameReview(gameId);
            setReviewData(reviewAnalysis);
          } catch (err) {
            console.error("Analysis failed:", err);
          } finally {
            setAnalysisLoading(false);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load game.");
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, user?.premium]);

  useEffect(() => {
    if (
      fens.length > 0 &&
      currentMoveIndex >= 0 &&
      currentMoveIndex < fens.length
    ) {
      setBoard(fenToBoardGrid(fens[currentMoveIndex]));
    }
  }, [currentMoveIndex, fens]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0A0F2C] to-[#1B1452]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <h2>Loading Game Replay...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#0A0F2C] to-[#1B1452]">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white/10 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentReview =
    currentMoveIndex > 0 ? reviewData[currentMoveIndex - 1] : null;

  // Evaluation Bar logic
  let evalScore = 0;
  if (currentReview?.evaluation) {
    const { score, mate } = currentReview.evaluation;
    if (mate !== null) {
      evalScore = mate > 0 ? 1000 : -1000;
    } else {
      evalScore = score / 100; // convert to pawns
    }
  }

  // Convert -10 to +10 range to 0-100% for the bar
  const boundedScore = Math.max(-10, Math.min(10, evalScore));
  const whiteAdvantagePercent = ((boundedScore + 10) / 20) * 100;

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "BRILLIANT":
        return "text-cyan-400 font-black";
      case "GREAT":
        return "text-blue-400 font-bold";
      case "BLUNDER":
        return "text-red-500";
      case "MISTAKE":
        return "text-orange-500";
      case "INACCURACY":
        return "text-yellow-500";
      case "GOOD":
        return "text-gray-200";
      case "EXCELLENT":
        return "text-green-400";
      case "BEST":
        return "text-green-300 font-bold";
      case "BOOK":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getClassificationSymbol = (classification: string) => {
    switch (classification) {
      case "BRILLIANT":
        return "!!";
      case "GREAT":
        return "!";
      case "BLUNDER":
        return "??";
      case "MISTAKE":
        return "?";
      case "INACCURACY":
        return "?!";
      case "GOOD":
        return "✓";
      case "EXCELLENT":
        return "!";
      case "BEST":
        return "★";
      case "BOOK":
        return "📖";
      default:
        return "";
    }
  };

  const getEvaluationPoints = () => {
    return reviewData.map((d) => {
      let score = 0;
      if (d.evaluation.mate !== null) {
        score = d.evaluation.mate > 0 ? 10 : -10;
      } else {
        score = Math.max(-10, Math.min(10, d.evaluation.score / 100));
      }
      return score;
    });
  };

  const evalPoints = getEvaluationPoints();

  return (
    <div className="w-full h-screen bg-[#070B24] flex flex-col overflow-hidden text-white relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6zM36 4V0h-2v4h-4v2h4v4h2V6h4V4h-6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="w-full px-6 py-3 bg-[#11193F]/40 backdrop-blur-sm border-b border-[#FFD166]/20 shrink-0 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[#FFD166] tracking-tight">
          Game Review
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-8">
        {/* LEFT COLUMN: Performance & Analytics */}
        <div className="hidden lg:flex w-[320px] flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
          {/* Accuracy Card */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-xs font-black text-[#FFD166] uppercase tracking-[0.2em] mb-1">
              Game Accuracy
            </h3>
            <div className="flex items-center gap-2 -mt-1">
              <span className="text-4xl font-black text-white leading-tight tracking-tighter">
                {stats?.accuracy}
              </span>
              <span className="text-4xl font-black text-[#FFD166] leading-tight tracking-tighter">
                %
              </span>
            </div>
          </div>

          {/* Classification Stats */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5">
              Move Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "BRILLIANT", label: "!!" },
                { key: "GREAT", label: "!" },
                { key: "BEST", label: "★" },
                { key: "EXCELLENT", label: "!" },
                { key: "BOOK", label: "📖" },
                { key: "GOOD", label: "✓" },
                { key: "INACCURACY", label: "?!" },
                { key: "MISTAKE", label: "?" },
                { key: "BLUNDER", label: "??" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="bg-black/30 rounded-xl p-3 flex flex-col items-center border border-white/5 group/stat relative overflow-hidden transition-all hover:bg-black/50"
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover/stat:opacity-20 transition-opacity`}
                    style={{
                      background: `radial-gradient(circle, ${getClassificationColor(item.key).replace("text-", "")}, transparent)`,
                    }}
                  />
                  <span
                    className={`text-xl font-black leading-tight ${getClassificationColor(item.key)}`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    {stats?.counts[item.key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend Table */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-md mt-auto">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.1em] mb-4">
              Key
            </h3>
            <div className="grid grid-cols-1 gap-2 opacity-60 text-xs">
              {[
                { label: "Brilliant", color: "bg-cyan-400" },
                { label: "Best", color: "bg-green-300" },
                { label: "Blunder", color: "bg-red-500" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${l.color} shadow-[0_0_8px_currentColor]`}
                  />
                  <span className="font-bold tracking-wide">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Board & Momentum */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 min-h-0">
          <div className="flex justify-center items-center gap-6 w-full max-w-[1000px] h-full max-h-[82vh]">
            {/* Evaluation Bar */}
            <div
              className={`h-full w-3 rounded-full overflow-hidden flex flex-col-reverse relative bg-white/5 border border-white/10 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
              style={{ minHeight: "400px", height: "100%" }}
            >
              <div
                className="w-full bg-white transition-all duration-1000 ease-in-out"
                style={{ height: `${whiteAdvantagePercent}%` }}
              ></div>
              <div className="absolute inset-x-0 bottom-4 text-center mix-blend-difference text-white text-[10px] font-black tracking-tighter">
                {currentReview?.evaluation?.mate !== null
                  ? `M${Math.abs(currentReview?.evaluation?.mate || 0)}`
                  : Math.abs(evalScore).toFixed(1)}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0 h-full py-2">
              {/* Opponent (Black) */}
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={blackPlayer?.avatar || "/images/stockfish-avatar.png"}
                    alt="Black"
                    className="w-10 h-10 rounded-lg border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                  />
                  <div>
                    <span className="block text-sm font-bold text-white leading-none mb-1">
                      {blackPlayer?.name || "Stockfish"}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono tracking-tighter">
                      {blackPlayer?.rating || 3000} ELO
                    </span>
                  </div>
                </div>
                {currentMoveIndex > 0 &&
                  currentMoveIndex % 2 === 0 &&
                  currentReview && (
                    <div
                      className={`text-[11px] font-black px-2 py-1 rounded bg-white/5 ${getClassificationColor(currentReview.classification)} tracking-tight`}
                    >
                      {currentReview.classification}
                    </div>
                  )}
              </div>

              {/* Board Container with Glow */}
              <div
                className="relative flex-[10] aspect-square rounded-xl transition-all duration-700 p-1 mx-auto min-h-0"
                style={{
                  background: `linear-gradient(45deg, ${evalScore > 0 ? "rgba(255,255,255,0.2)" : "rgba(59,130,246,0.2)"}, transparent)`,
                  boxShadow: `0 0 60px ${evalScore > 0 ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.1)"}`,
                }}
              >
                <div className="w-full h-full max-w-full max-h-full">
                  <Chessboard
                    board={board}
                    selectedSquare={null}
                    legalMoves={[]}
                    onSquareClick={() => {}}
                    orientation="white"
                  />
                </div>
              </div>

              {/* Player (White) */}
              <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={whitePlayer?.avatar || "/images/stockfish-avatar.png"}
                    alt="White"
                    className="w-10 h-10 rounded-lg border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                  />
                  <div>
                    <span className="block text-sm font-bold text-white leading-none mb-1">
                      {whitePlayer?.name || "You"}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono tracking-tighter">
                      {whitePlayer?.rating || 1500} ELO
                    </span>
                  </div>
                </div>
                {currentMoveIndex > 0 &&
                  currentMoveIndex % 2 !== 0 &&
                  currentReview && (
                    <div
                      className={`text-[11px] font-black px-2 py-1 rounded bg-white/5 ${getClassificationColor(currentReview.classification)} tracking-tight`}
                    >
                      {currentReview.classification}
                    </div>
                  )}
              </div>

              {/* Evaluation Graph [NEW] */}
              {evalPoints.length > 0 && (
                <div className="w-full h-16 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer shrink-0">
                  <svg
                    className="w-full h-full"
                    viewBox={`0 -10 ${evalPoints.length} 20`}
                    preserveAspectRatio="none"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const index = Math.floor(
                        (x / rect.width) * evalPoints.length,
                      );
                      setCurrentMoveIndex(Math.max(0, index));
                    }}
                  >
                    {/* Baseline */}
                    <line
                      x1="0"
                      y1="0"
                      x2={evalPoints.length}
                      y2="0"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="0.1"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient
                        id="graphGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="rgba(255,255,255,0.2)"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(59,130,246,0.2)"
                          stopOpacity="0.1"
                        />
                      </linearGradient>
                    </defs>

                    {/* Path */}
                    <path
                      d={`M 0 0 ${evalPoints.map((p, i) => `L ${i} ${-p}`).join(" ")} L ${evalPoints.length - 1} 0 Z`}
                      fill="url(#graphGradient)"
                    />
                    <path
                      d={`M 0 ${-evalPoints[0]} ${evalPoints.map((p, i) => `L ${i} ${-p}`).join(" ")}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="0.2"
                      className="transition-all duration-300"
                    />

                    {/* Current Position Marker */}
                    <line
                      x1={currentMoveIndex}
                      y1="-10"
                      x2={currentMoveIndex}
                      y2="10"
                      stroke="#FFD166"
                      strokeWidth="0.3"
                    />
                  </svg>
                  <div className="absolute top-1 left-3 text-[9px] font-black text-gray-500 uppercase tracking-widest pointer-events-none">
                    Momentum
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Move List & Controls */}
        <div className="w-full lg:w-[380px] flex flex-col bg-[#11193F]/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
          {/* Current Move Detail */}
          <div className="p-6 bg-gradient-to-br from-black/70 to-black/30 border-b border-white/10 min-h-[160px] flex flex-col justify-center relative group">
            {analysisLoading && (
              <div className="absolute top-4 right-4">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {currentMoveIndex === 0 ? (
              <div className="text-center p-4">
                <h3 className="text-lg font-bold text-gray-300">
                  Initial Position
                </h3>
                <p className="text-xs text-gray-500">
                  Study the opening strategy.
                </p>
              </div>
            ) : currentReview ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`text-2xl font-black tracking-tighter ${getClassificationColor(currentReview.classification)}`}
                  >
                    {currentReview.classification}
                  </div>
                  <div className="flex-1 h-px bg-white/10" />
                  <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    Eval:{" "}
                    {currentReview.evaluation?.mate
                      ? `M${currentReview.evaluation.mate}`
                      : (currentReview.evaluation?.score / 100).toFixed(2)}
                  </div>
                </div>
                <p className="text-[13px] text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 italic">
                  "{currentReview.description}"
                </p>
              </div>
            ) : !user?.premium ? (
              <div className="text-center py-4 px-6">
                <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-yellow-500 mb-1">
                  Master Insights Locked
                </h3>
                <Link
                  to="/pricing"
                  className="text-[10px] font-black text-blue-400 hover:underline uppercase tracking-[0.2em]"
                >
                  Upgrade
                </Link>
              </div>
            ) : (
              <div className="text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                Searching...
              </div>
            )}
          </div>

          {/* Move List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {reviewData.map((data, idx) => {
              const moveNum = Math.floor(idx / 2) + 1;
              const isWhite = idx % 2 === 0;
              const active = currentMoveIndex === idx + 1;
              const move = moveHistory[idx];
              const moveText = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}-${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentMoveIndex(idx + 1)}
                  className={`w-full text-left px-3 py-2 rounded flex justify-between items-center transition-colors ${active ? "bg-blue-500/30 border border-blue-500/50" : "hover:bg-white/5 border border-transparent"}`}
                >
                  <span className="text-gray-400 w-8">
                    {isWhite ? moveNum + "." : ""}
                  </span>
                  <span className="flex-1 font-mono">{moveText}</span>
                  {user?.premium ? (
                    <span
                      className={`font-bold ${getClassificationColor(data.classification)}`}
                    >
                      {getClassificationSymbol(data.classification)}
                    </span>
                  ) : (
                    <Lock className="w-3 h-3 text-gray-600 opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-white/10 bg-black/20 flex justify-center gap-2">
            <button
              onClick={() => setCurrentMoveIndex(0)}
              disabled={currentMoveIndex === 0}
              className="p-3 bg-white/10 rounded-lg disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMoveIndex((c) => Math.max(0, c - 1))}
              disabled={currentMoveIndex === 0}
              className="p-3 bg-white/10 rounded-lg disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentMoveIndex((c) => Math.min(fens.length - 1, c + 1))
              }
              disabled={currentMoveIndex === fens.length - 1}
              className="p-3 bg-white/10 rounded-lg disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMoveIndex(fens.length - 1)}
              disabled={currentMoveIndex === fens.length - 1}
              className="p-3 bg-white/10 rounded-lg disabled:opacity-30 hover:bg-white/20 transition-colors"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
