import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Chess, type Square } from "chess.js";
import {
  ChevronLeft,
  Lightbulb,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  Trophy,
  Brain,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Chessboard } from "../../components/user/Match/ChessBoard";
import {
  fetchPuzzleByDifficulty,
  validatePuzzleMove,
} from "../../Service/api/userPuzzleApi";
import { isTodaysDifficulty } from "../../utils/getDailyDifficulty";
import toast from "react-hot-toast";

// Difficulty config
const difficultyConfig = {
  easy: {
    name: "Easy",
    icon: Lightbulb,
    color: "from-emerald-400 to-cyan-500",
    accent: "text-emerald-400",
    description: "One-move mates and basic hanging pieces",
  },
  medium: {
    name: "Medium",
    icon: ShieldCheck,
    color: "from-blue-500 to-indigo-600",
    accent: "text-blue-400",
    description: "Common tactical patterns like forks and pins",
  },
  hard: {
    name: "Hard",
    icon: Zap,
    color: "from-orange-500 to-red-600",
    accent: "text-orange-400",
    description: "Multi-move sequences and complex combinations",
  },
  expert: {
    name: "Expert",
    icon: Trophy,
    color: "from-blue-600 to-red-600",
    accent: "text-purple-400",
    description: "Grandmaster level challenges",
  },
};


const pieceTypeMap: Record<string, "PAWN" | "ROOK" | "KNIGHT" | "BISHOP" | "QUEEN" | "KING"> = {
  p: "PAWN",
  r: "ROOK",
  n: "KNIGHT",
  b: "BISHOP",
  q: "QUEEN",
  k: "KING",
};

export function PuzzleSolvingPage() {
  const { difficulty = "easy" } = useParams<{ difficulty: string }>();
  const navigate = useNavigate();
  const config =
    difficultyConfig[difficulty as keyof typeof difficultyConfig] ||
    difficultyConfig.easy;
  const isDailyChallenge = isTodaysDifficulty(difficulty);

  const [game, setGame] = useState(new Chess());
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [initialFen, setInitialFen] = useState("");
  const [selectedSquare, setSelectedSquare] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [loading, setLoading] = useState(true);

  const board = useMemo(() => {
    return game.board().map((row) =>
      row.map((cell) => {
        if (!cell) return null;
        return {
          type: pieceTypeMap[cell.type],
          color: (cell.color === "w" ? "WHITE" : "BLACK") as "WHITE" | "BLACK",
          hasMoved: false,
        };
      })
    );
  }, [game]);

  const loadNewPuzzle = useCallback(async () => {
    try {
      // Only set loading to true if it's not already loading
      setLoading(prev => prev ? prev : true);
      setIsSolved(false);
      setIsWrong(false);
      const data = await fetchPuzzleByDifficulty(difficulty);
      const newGame = new Chess(data.fen);
      setGame(newGame);
      setPuzzleId(data.id);
      setInitialFen(data.fen);
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load puzzle";
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    loadNewPuzzle();
  }, [loadNewPuzzle]);

  const handleSquareClick = async (row: number, col: number) => {
    if (isSolved || loading) return;

    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const square = `${files[col]}${8 - row}`;

    if (selectedSquare) {
      const fromSquare = `${files[selectedSquare.col]}${
        8 - selectedSquare.row
      }`;

      try {
        // Clone the game so we never mutate the state object in-place
        const gameCopy = new Chess(game.fen());
        const moveAttempt = gameCopy.move({
          from: fromSquare,
          to: square,
          promotion: "q",
        });

        if (moveAttempt) {
          // Save the FEN before this move so we can undo cleanly
          const fenBeforeMove = game.fen();
          const fenAfterMove = gameCopy.fen();

          // Apply the move to the board
          setGame(new Chess(fenAfterMove));
          setSelectedSquare(null);

          if (puzzleId) {
            const result = await validatePuzzleMove(puzzleId, moveAttempt.san);

            if (result.correct) {
              setIsWrong(false);
              if (result.nextMove) {
                // Play engine response
                setTimeout(() => {
                  const updatedGame = new Chess(fenAfterMove);
                  updatedGame.move(result.nextMove);
                  setGame(new Chess(updatedGame.fen()));
                  if (result.solved) {
                    setIsSolved(true);
                  }
                }, 500);
              } else if (result.solved) {
                setIsSolved(true);
              }
            } else {
              // Wrong move — revert to position before the bad move
              setIsWrong(true);
              setTimeout(() => {
                setGame(new Chess(fenBeforeMove));
                setIsWrong(false);
              }, 1000);
            }
          }
        } else {
          // Invalid chess move or clicking another piece
          const piece = game.get(square as Square);
          if (piece && piece.color === game.turn()) {
            setSelectedSquare({ row, col });
          } else {
            setSelectedSquare(null);
          }
        }
      } catch {
        setSelectedSquare(null);
      }
    } else {
      const piece = game.get(square as Square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const resetPuzzle = () => {
    setGame(new Chess(initialFen));
    setIsSolved(false);
    setIsWrong(false);
    setSelectedSquare(null);
  };

  const legalMoves = useMemo(() => {
    if (!selectedSquare) return [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const square = `${files[selectedSquare.col]}${8 - selectedSquare.row}`;
    return game.moves({ square: square as Square, verbose: true }).map((m) => ({
      row: 8 - parseInt(m.to[1]),
      col: files.indexOf(m.to[0]),
      type: "NORMAL" as const,
    }));
  }, [selectedSquare, game]);

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white flex flex-col font-['Inter']">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-1/4 -right-1/4 w-[60%] h-[60%] bg-gradient-to-br ${config.color} opacity-5 blur-[150px] rounded-full`}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 bg-[#11193F]/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate("/puzzles")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${config.color} shadow-lg shadow-black/20`}
            >
              <config.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none mb-1">
                {config.name} Puzzle
              </h1>
              <p className="text-xs text-[#C9CAD9] opacity-60 uppercase tracking-wider font-semibold">
                Tactical Training
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDailyChallenge && (
            <div className="flex items-center gap-2 bg-[#FFD166]/10 px-4 py-2 rounded-xl border border-[#FFD166]/20">
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span className="text-[#FFD166] font-bold text-sm">
                Daily Challenge
              </span>
            </div>
          )}
          <button
            onClick={loadNewPuzzle}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all font-semibold text-sm"
          >
            Next Puzzle
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-[#FFD166]/10 px-4 py-2 rounded-xl border border-[#FFD166]/20">
            <Star className="w-4 h-4 text-[#FFD166] fill-[#FFD166]" />
            <span className="text-[#FFD166] font-bold text-sm">3,420</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-6 gap-8 overflow-hidden">
        {/* Left Side: Board Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-[650px] aspect-square relative">
            {/* Action Feedback Overlays */}
            <AnimatePresence>
              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div
                    className="relative 
  bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
  border border-indigo-500/40
  p-8 rounded-2xl
  shadow-[0_0_30px_rgba(99,102,241,0.15)]
  flex flex-col items-center gap-4
  backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 pointer-events-none" />
                    <CheckCircle2 className="w-14 h-14 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                    <span className="text-2xl font-semibold text-indigo-300 tracking-wide">
                      Puzzle Solved
                    </span>

                    <span className="text-sm text-zinc-400 tracking-wide">
                      Tactical precision achieved ♞
                    </span>
                  </div>
                </motion.div>
              )}
              {isWrong && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-red-500/75 backdrop-blur-md border border-red-500/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                    <AlertCircle className="w-16 h-16 text-red-1000" />
                    <span className="text-2xl font-bold text-white">
                      Try Again
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Board Glow Effect */}
            <div
              className={`absolute -inset-4 bg-gradient-to-br ${config.color} opacity-10 blur-2xl rounded-2xl`}
            />

            <div
              className={`relative w-full h-full bg-[#11193F]/60 backdrop-blur-sm rounded-xl border border-white/10 p-2 shadow-2xl transition-all ${
                isWrong
                  ? "ring-4 ring-red-500/50"
                  : isSolved
                  ? "ring-4 ring-emerald-500/50"
                  : ""
              }`}
            >
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-[#0A0F2C]/50 rounded-lg">
                  <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : (
                <Chessboard
                  board={board}
                  onSquareClick={handleSquareClick}
                  selectedSquare={selectedSquare}
                  legalMoves={legalMoves}
                  orientation="white"
                />
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4 w-full max-w-[650px]">
            <button
              onClick={resetPuzzle}
              className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-3 font-semibold group"
            >
              <RotateCcw className="w-5 h-5 text-blue-400 group-hover:rotate-[-45deg] transition-transform" />
              Reset
            </button>
            <button className="flex-1 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-3 font-semibold group">
              <Lightbulb className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
              Hint
            </button>
            <button
              onClick={loadNewPuzzle}
              className="flex-[1.5] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#3A6FF7] to-[#1B1452] hover:shadow-[0_0_20px_rgba(58,111,247,0.3)] transition-all flex items-center justify-center gap-3 font-bold"
            >
              Next Puzzle
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          {/* Puzzle Status Card */}
          <section className="bg-[#11193F]/40 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Puzzle #{puzzleId?.slice(-4) || "----"}
                </h2>
                <p className="text-sm text-[#C9CAD9] opacity-60">
                  {game.turn() === "w" ? "White" : "Black"} to move
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[#C9CAD9] text-sm">Difficulty Level</span>
                <div className="flex items-center gap-2">
                  {isDailyChallenge && (
                    <span className="text-[10px] font-bold text-[#FFD166] uppercase tracking-wider bg-[#FFD166]/10 px-2 py-0.5 rounded-full border border-[#FFD166]/20">
                      Daily
                    </span>
                  )}
                  <span className={`font-bold ${config.accent}`}>
                    {config.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[#C9CAD9] text-sm">Status</span>
                <span
                  className={`font-bold ${
                    isSolved ? "text-emerald-400" : "text-blue-400"
                  }`}
                >
                  {isSolved ? "Completed" : "Solving..."}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm leading-relaxed text-[#C9CAD9]">
                Find the tactical sequence that gains a material advantage or
                leads to checkmate. Watch out for defensive resources!
              </p>
            </div>
          </section>

          {/* Tips Card */}
          <section className="flex-1 bg-[#11193F]/20 backdrop-blur-md rounded-[2rem] border border-white/5 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FFD166]" />
                Tactical Tip
              </h3>
            </div>

            <div className="flex-1 text-sm text-[#C9CAD9] leading-relaxed opacity-80">
              <p className="mb-4">Before making a move, look for:</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#FFD166] mt-2 shrink-0" />
                  Checks, captures, and threats (CCT).
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#FFD166] mt-2 shrink-0" />
                  Hanging pieces in the opponent's camp.
                </li>
                <li className="flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#FFD166] mt-2 shrink-0" />
                  Geometry: Are two pieces on the same line?
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-[#C9CAD9] opacity-60">
                <ShieldCheck className="w-4 h-4" />
                Consistency is key to improvement.
              </div>
            </div>
          </section>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
