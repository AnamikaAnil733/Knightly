import { Piece_Images } from "../../Reuseable/ChessPieces";
import { motion } from "framer-motion";

type Props = {
  color: "WHITE" | "BLACK";
  onSelect: (type: "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT") => void;
};

export function PromotionModal({ color, onSelect }: Props) {
  const pieces = ["QUEEN", "ROOK", "BISHOP", "KNIGHT"] as const;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#070B24]/80 backdrop-blur-sm z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#11193F]/90 p-4 lg:p-6 rounded-2xl flex flex-col items-center gap-4 lg:gap-6 border border-[#3A6FF7]/50 shadow-[0_0_50px_rgba(58,111,247,0.3)]"
      >
        <h3 className="text-[#FFD166] font-bold text-lg lg:text-xl tracking-tight uppercase">
          Choose Promotion
        </h3>
        <div className="flex gap-3 lg:gap-6">
          {pieces.map((type) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="relative group p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#3A6FF7]/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-[#3A6FF7]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <img
                src={Piece_Images[color][type]}
                alt={`${color} ${type}`}
                className="w-12 h-12 lg:w-16 lg:h-16 relative z-10 group-hover:scale-110 transition-transform duration-300"
                draggable={false}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#C9CAD9] opacity-0 group-hover:opacity-100 transition-opacity">
                {type}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
