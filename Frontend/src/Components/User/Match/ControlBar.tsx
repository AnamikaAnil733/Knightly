import { FlagIcon, HandshakeIcon, AlertTriangle } from "lucide-react";

type ControlBarProps = {
  onResign?: () => void;
  onDraw?: () => void;
  onRematch?: () => void;
  onReport?: () => void;
  hideDraw?: boolean;
  hideReport?: boolean;
};

export function ControlBar({
  onResign,
  onDraw,
  onReport,
  hideDraw = false,
  hideReport = false,
}: ControlBarProps) {
  const colCount = [!hideDraw, true, !hideReport].filter(Boolean).length;

  return (
    <div
      className={`grid ${colCount === 1 ? "grid-cols-1" : `grid-cols-${colCount} lg:grid-cols-1`} gap-1.5 sm:gap-2 lg:gap-3 w-full`}
    >
      {/* Offer Draw */}
      {!hideDraw && (
        <button
          onClick={onDraw}
          className="group relative w-full px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-xl bg-[#FFD166]/5 hover:bg-[#FFD166]/10 border border-[#FFD166]/20 hover:border-[#FFD166]/40 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3">
            <HandshakeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
            <span className="font-bold text-[#FFD166]/90 group-hover:text-[#FFD166] text-[9px] sm:text-[10px] lg:text-sm uppercase tracking-wider">
              <span className="hidden xs:inline sm:inline">Offer </span>Draw
            </span>
          </div>
        </button>
      )}

      {/* Resign */}
      <button
        onClick={onResign}
        className="group w-full px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-xl bg-[#E74C3C]/5 hover:bg-[#E74C3C]/10 border border-[#E74C3C]/20 hover:border-[#E74C3C]/40 transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3">
          <FlagIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#E74C3C] group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[#E74C3C]/90 group-hover:text-[#E74C3C] text-[9px] sm:text-[10px] lg:text-sm uppercase tracking-wider">
            Resign
          </span>
        </div>
      </button>

      {/* Report */}
      {!hideReport && (
        <button
          onClick={onReport}
          className="group w-full px-1.5 sm:px-2 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-xl bg-orange-600/5 hover:bg-orange-600/10 border border-orange-600/20 hover:border-orange-600/40 transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-orange-500/90 group-hover:text-orange-500 text-[9px] sm:text-[10px] lg:text-sm uppercase tracking-wider">
              Report
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
