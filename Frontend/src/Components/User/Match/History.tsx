import { useEffect, useRef } from "react";
import { formatMove } from "../../../Utils/MoveFormat";

type MoveDTO = {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: string;
  color: "WHITE" | "BLACK";
  promotion?: string;
};

export function MoveList({
  history,
  status,
}: {
  history: MoveDTO[];
  status:
    | "ACTIVE"
    | "CHECK"
    | "CHECKMATE"
    | "STALEMATE"
    | "WHITE_TIMEOUT"
    | "BLACK_TIMEOUT"
    | "WHITE_RESIGNED"
    | "BLACK_RESIGNED"
    | "DRAW_BY_REPETITION"
    | "DRAW_BY_FIFTY_MOVES"
    | "DRAW_BY_INSUFFICIENT_MATERIAL";
}) {
  const moves = [];
  const lastMoveIndex = history.length - 1;

  const containerRef = useRef<HTMLDivElement>(null);

  // 🔽 Auto-scroll to bottom whenever history changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [history.length]);

  // Build move rows
  for (let i = 0; i < history.length; i += 2) {
    moves.push({
      number: i / 2 + 1,
      white: history[i]
        ? formatMove(history[i], {
            isCheck: status === "CHECK" && i === lastMoveIndex,
            isCheckmate: status === "CHECKMATE" && i === lastMoveIndex,
          })
        : "",
      black: history[i + 1]
        ? formatMove(history[i + 1], {
            isCheck: status === "CHECK" && i + 1 === lastMoveIndex,
            isCheckmate: status === "CHECKMATE" && i + 1 === lastMoveIndex,
          })
        : "",
    });
  }

  return (
    <div
      className="w-full h-full rounded-xl backdrop-blur-md bg-[#11193F]/70 border border-[#3A6FF7]/30 p-6 flex flex-col"
      style={{
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h3 className="text-white font-semibold text-lg mb-4 pb-3 border-b border-[#FFD166]/20 tracking-wide">
        Move List
      </h3>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
      >
        {moves.map((move, index) => {
          const isLastRow = index === moves.length - 1;

          return (
            <div
              key={move.number}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg
                ${
                  isLastRow
                    ? "bg-[#1C2445]/60 text-white"
                    : "text-[#C9CAD9] hover:bg-[#1C2445]/50"
                }
                cursor-pointer transition-all duration-200
              `}
            >
              {isLastRow && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-[#FFD166] rounded-r" />
              )}

              <span className="text-sm font-medium w-6">{move.number}.</span>

              <span className="flex-1 text-sm font-medium tracking-wide">
                {move.white}
              </span>

              <span className="flex-1 text-sm font-medium tracking-wide">
                {move.black}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(28, 36, 69, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 209, 102, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 209, 102, 0.5);
        }
      `}</style>
    </div>
  );
}
