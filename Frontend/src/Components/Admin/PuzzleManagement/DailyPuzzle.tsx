import { Puzzle } from "../../../Pages/Admin/PuzzleManagement";
import { ChessboardPreview } from "./ChessBoardPreview";
import { CalendarIcon, TrophyIcon } from "lucide-react";
interface DailyPuzzleProps {
  puzzle: Puzzle;
}
export function DailyPuzzle({ puzzle }: DailyPuzzleProps) {
  return (
    <div
      className="bg-gradient-to-b from-[#11193F] to-[#0A0F2C] rounded-xl p-5 
                   shadow-[0_0_25px_rgba(107,46,255,0.5)] 
                   border border-[#6B2EFF]/30 relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6B2EFF]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-10 w-40 h-40 bg-[#3A6FF7]/20 rounded-full blur-3xl"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <TrophyIcon size={18} className="text-[#FFD166]" />
          <h3 className="text-lg font-bold text-white">Daily Puzzle</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#C9CAD9] mb-4">
          <CalendarIcon size={14} />
          <span>Today's Challenge</span>
        </div>
        <div className="mb-4 w-full">
          <ChessboardPreview fen={puzzle.fen} />
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xs text-[#C9CAD9]">Difficulty</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${puzzle.difficulty === "Easy" ? "bg-green-900/40 text-green-300" : puzzle.difficulty === "Medium" ? "bg-blue-900/40 text-blue-300" : puzzle.difficulty === "Hard" ? "bg-orange-900/40 text-orange-300" : "bg-red-900/40 text-red-300"}`}
            >
              {puzzle.difficulty}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#C9CAD9]">Solution</span>
            <span className="ml-2 text-white text-xs font-mono">
              {puzzle.moves.slice(0, 2).join(", ")}
              {puzzle.moves.length > 2 ? "..." : ""} ({puzzle.solutionLength}{" "}
              moves)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
