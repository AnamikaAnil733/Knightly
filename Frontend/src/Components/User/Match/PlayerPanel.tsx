import { CrownIcon } from "lucide-react";
interface PlayerPanelProps {
  name: string;
  rating: number;
  avatar: string;
  time: string;
  isOpponent: boolean;
  isYourTurn?: boolean;
}
export function PlayerPanel({
  name,
  rating,
  avatar,
  time,
  isOpponent,
  isYourTurn,
}: PlayerPanelProps) {
  return (
    <div
      className={`
        w-full px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-xl backdrop-blur-md
        bg-[#11193F]/70 border border-[#3A6FF7]/30
        flex items-center justify-between
        ${isYourTurn ? "ring-2 ring-[#3A6FF7] animate-pulse" : ""}
      `}
      style={{
        boxShadow: isYourTurn
          ? "0 0 15px rgba(58, 111, 247, 0.3)"
          : "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Player Info */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-7 h-7 sm:w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#FFD166]/50"
        />
        <div>
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            <h3
              className="text-white font-semibold text-xs sm:text-sm lg:text-base truncate max-w-[80px] sm:max-w-[150px] lg:max-w-none"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {name}
            </h3>
            {rating > 2400 && (
              <CrownIcon className="w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 text-[#FFD166]" />
            )}
          </div>
          <p className="text-[#C9CAD9] text-[9px] sm:text-[10px] lg:text-xs">
            Rating: {rating}
          </p>
        </div>
      </div>
      {/* Timer */}
      {time && (
        <div
          className={`
            px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg font-bold text-sm sm:text-base lg:text-xl
            ${isOpponent ? "bg-[#FFD166]/10 text-[#FFD166]" : "bg-[#3A6FF7]/10 text-[#3A6FF7]"}
          `}
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {time}
        </div>
      )}
    </div>
  );
}
