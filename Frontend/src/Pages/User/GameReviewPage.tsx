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
      case "BLUNDER":
        return "text-red-500";
      case "MISTAKE":
        return "text-orange-500";
      case "INACCURACY":
        return "text-yellow-500";
      case "GOOD":
        return "text-blue-400";
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
      case "BLUNDER":
        return "??";
      case "MISTAKE":
        return "?";
      case "INACCURACY":
        return "?!";
      case "GOOD":
        return "!";
      case "EXCELLENT":
        return "!!";
      case "BEST":
        return "★";
      case "BOOK":
        return "📖";
      default:
        return "";
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0A0F2C] to-[#1B1452] flex flex-col overflow-hidden text-white">
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
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Left: Evaluation bar + Board */}
        <div className="flex-1 flex justify-center items-center gap-4 min-h-0">
          {/* Evaluation Bar */}
          <div className="h-full max-h-[600px] w-8 bg-gray-600 rounded-sm overflow-hidden flex flex-col-reverse relative shadow-lg">
            <div
              className="w-full bg-white transition-all duration-300"
              style={{ height: `${whiteAdvantagePercent}%` }}
            ></div>
            <div className="absolute inset-x-0 bottom-2 text-center mix-blend-difference text-white text-xs font-bold">
              {currentReview?.evaluation?.mate !== null
                ? `M${Math.abs(currentReview?.evaluation?.mate || 0)}`
                : Math.abs(evalScore).toFixed(1)}
            </div>
          </div>

          {/* Board */}
          <div className="relative aspect-square max-h-[600px] w-full max-w-[600px]">
            <Chessboard
              board={board}
              selectedSquare={null}
              legalMoves={[]}
              onSquareClick={() => {}}
              orientation="white"
            />
          </div>
        </div>

        {/* Right: Analysis & Controls */}
        <div className="w-full lg:w-[400px] flex flex-col bg-[#11193F]/50 rounded-xl border border-white/10 overflow-hidden">
          {/* Current Move Analysis Banner */}
          <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col items-center justify-center min-h-[160px] relative">
            {analysisLoading && (
              <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 bg-blue-500/20 rounded border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400">
                  Analysis Pending...
                </span>
              </div>
            )}
            {currentMoveIndex === 0 ? (
              <h2 className="text-xl font-bold text-gray-300">
                Starting Position
              </h2>
            ) : reviewData.length > 0 && currentReview ? (
              <div className="text-center">
                <div
                  className={`text-3xl font-bold mb-1 ${getClassificationColor(currentReview.classification)}`}
                >
                  {currentReview.classification}{" "}
                  {getClassificationSymbol(currentReview.classification)}
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  Engine Eval:{" "}
                  {currentReview.evaluation?.mate
                    ? `Mate in ${currentReview.evaluation.mate}`
                    : `${(currentReview.evaluation?.score / 100).toFixed(2)}`}
                </p>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-sm text-gray-200 leading-relaxed italic">
                    "{currentReview.description}"
                  </p>
                </div>
              </div>
            ) : !user?.premium ? (
              <div className="text-center p-4">
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-[#F7E7CE] to-[#D4AF37]">
                    <Crown className="w-5 h-5 text-black" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#F7E7CE] mb-1">
                  Advanced Analysis
                </h3>
                <p className="text-xs text-gray-400 mb-4 px-4 line-clamp-2">
                  Blunder detection, move classifications, and master insights.
                </p>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#F7E7CE] via-[#E7D4B5] to-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/20"
                >
                  Unlock with Premium
                </Link>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-gray-300">
                Move {currentMoveIndex}
              </h2>
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
