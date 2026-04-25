import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Chessboard } from "../../Components/User/Match/ChessBoard";
import { getGame, getGameReview } from "../../Service/Api/ChessApi";
import {
  fenToBoardGrid,
  movesToFens,
  findCheckSquare,
} from "../../Utils/ChessUtils";
import { BoardGrid, MoveDTO, AnalysisData } from "../../Types/Chess";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  MessageSquare,
  History,
} from "lucide-react";
import { ChatPanel } from "../../Components/User/Match/Chat";

export function AdminMatchReview() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [board, setBoard] = useState<BoardGrid>([]);
  const [fens, setFens] = useState<string[]>([]);
  const [reviewData, setReviewData] = useState<AnalysisData[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveDTO[]>([]);

  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const snapshotMessages = location.state?.chatMessages || [];

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;
      try {
        setLoading(true);
        const game = await getGame(gameId);
        const generatedFens = movesToFens(game.history);
        setFens(generatedFens);
        setMoveHistory(game.history);

        setCurrentMoveIndex(0);
        setBoard(fenToBoardGrid(generatedFens[0]));
        setLoading(false);

        // Admins ALWAYS get full analysis
        setAnalysisLoading(true);
        try {
          const reviewAnalysis = await getGameReview(gameId);
          setReviewData(reviewAnalysis);
        } catch (err) {
          console.error("Analysis failed:", err);
        } finally {
          setAnalysisLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load match data for audit.");
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  useEffect(() => {
    if (
      fens.length > 0 &&
      currentMoveIndex >= 0 &&
      currentMoveIndex < fens.length
    ) {
      setBoard(fenToBoardGrid(fens[currentMoveIndex]));
    }
  }, [currentMoveIndex, fens]);

  const checkSquare = useMemo(() => {
    return currentMoveIndex >= 0 && fens[currentMoveIndex]
      ? findCheckSquare(fens[currentMoveIndex])
      : null;
  }, [currentMoveIndex, fens]);

  const currentReview =
    currentMoveIndex > 0 ? reviewData[currentMoveIndex - 1] : null;

  let evalScore = 0;
  if (currentReview?.evaluation) {
    const { score, mate } = currentReview.evaluation;
    if (mate !== null) {
      evalScore = mate > 0 ? 1000 : -1000;
    } else {
      evalScore = score / 100;
    }
  }

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

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B2EFF] mb-4"></div>
        <p className="text-gray-400">Loading Auditor Board...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/admin/reports")}
          className="px-6 py-2 bg-[#6B2EFF] rounded-xl font-bold"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden text-white">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/reports")}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold pr-2">
              Back to Report Center
            </span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Match Auditor</h1>
            <p className="text-xs text-gray-500">
              Case ID: {gameId?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {analysisLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              Stockfish Auditing...
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-6">
        {/* Left: Board & Primary Info */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 flex justify-center items-center gap-6 min-h-0 bg-[#11193F]/30 rounded-3xl border border-white/5 p-8 relative">
            {/* Eval Bar */}
            <div className="h-full max-h-[500px] w-6 bg-gray-600 rounded-sm overflow-hidden flex flex-col-reverse relative ring-1 ring-white/10 shadow-2xl">
              <div
                className="w-full bg-white transition-all duration-300"
                style={{ height: `${whiteAdvantagePercent}%` }}
              ></div>
              <div className="absolute inset-x-0 bottom-2 text-center mix-blend-difference text-white text-[10px] font-bold">
                {currentReview?.evaluation?.mate !== null
                  ? `M${Math.abs(currentReview?.evaluation?.mate || 0)}`
                  : Math.abs(evalScore).toFixed(1)}
              </div>
            </div>

            <div className="relative aspect-square max-h-[500px] w-full max-w-[500px]">
              <Chessboard
                board={board}
                selectedSquare={null}
                legalMoves={[]}
                onSquareClick={() => {}}
                orientation="white"
                lastMove={
                  currentMoveIndex > 0
                    ? moveHistory[currentMoveIndex - 1]
                    : null
                }
                checkSquare={checkSquare}
              />
            </div>
          </div>

          {/* Analysis Snippet Bar */}
          {currentReview && (
            <div className="bg-[#1C2445]/50 border border-white/5 rounded-2xl p-4 flex items-center gap-6">
              <div
                className={`text-xl font-black italic ${getClassificationColor(currentReview.classification)} w-32 border-r border-white/5`}
              >
                {currentReview.classification}{" "}
                {getClassificationSymbol(currentReview.classification)}
              </div>
              <div className="flex-1">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">
                  Engine Comment
                </p>
                <p className="text-sm text-gray-300">
                  "{currentReview.description}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Moves & Chat Snapshot */}
        <div className="w-full lg:w-[400px] flex flex-col bg-[#11193F]/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Match Log
              </span>
            </div>
            <div className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded">
              Move {currentMoveIndex}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {moveHistory.map((move, idx) => {
              const moveNum = Math.floor(idx / 2) + 1;
              const isWhite = idx % 2 === 0;
              const active = currentMoveIndex === idx + 1;
              const classification = reviewData[idx];
              const moveText = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row} → ${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentMoveIndex(idx + 1)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex justify-between items-center transition-all ${
                    active
                      ? "bg-[#6B2EFF]/20 border border-[#6B2EFF]/50 text-white"
                      : "hover:bg-white/5 border border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] font-black w-6 opacity-30">
                    {isWhite ? moveNum + "." : ""}
                  </span>
                  <span className="flex-1 font-mono text-sm">{moveText}</span>
                  {classification && (
                    <span
                      className={`text-xs font-bold ${getClassificationColor(classification.classification)}`}
                    >
                      {getClassificationSymbol(classification.classification)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Audit Controls */}
          <div className="p-4 border-t border-white/10 bg-white/5 flex justify-center gap-2">
            <button
              onClick={() => setCurrentMoveIndex(0)}
              disabled={currentMoveIndex === 0}
              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMoveIndex((c) => Math.max(0, c - 1))}
              disabled={currentMoveIndex === 0}
              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentMoveIndex((c) => Math.min(fens.length - 1, c + 1))
              }
              disabled={currentMoveIndex === fens.length - 1}
              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMoveIndex(fens.length - 1)}
              disabled={currentMoveIndex === fens.length - 1}
              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 disabled:opacity-20 transition-all border border-white/5"
            >
              <ChevronsRight className="w-5 h-5" />
            </button>
          </div>

          {/* Evidence Panel */}
          {snapshotMessages.length > 0 && (
            <div className="h-[350px] border-t border-white/10 bg-[#0A0F2C]/40">
              <div className="p-3 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#6B2EFF]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#6B2EFF]">
                    Evidence Snapshot
                  </span>
                </div>
                <div className="p-1 px-2 border border-[#6B2EFF]/20 bg-[#6B2EFF]/10 rounded text-[9px] font-bold text-[#6B2EFF] uppercase">
                  Captured from Chat
                </div>
              </div>
              <div className="h-[300px]">
                <ChatPanel
                  gameId={gameId || ""}
                  senderName="Moderator"
                  messages={snapshotMessages}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
