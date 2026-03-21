import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ColorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: "WHITE" | "BLACK" | "RANDOM") => void;
  levelLabel: string;
}

export function ColorSelectionModal({
  isOpen,
  onClose,
  onSelect,
  levelLabel,
}: ColorSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#11193F] border border-[#3A6FF7]/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3A6FF7] to-transparent opacity-50" />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white font-['Poppins']">
                Choose Your Side
              </h2>
              <button
                onClick={onClose}
                className="text-[#C9CAD9] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-[#C9CAD9] mb-8 text-center bg-white/5 py-2 rounded-xl border border-white/5 font-medium">
              Playing Stockfish{" "}
              <span className="text-[#FFD166]">{levelLabel}</span>
            </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => onSelect("WHITE")}
                className="group relative flex items-center justify-between px-6 py-4 rounded-2xl bg-white text-black font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg overflow-hidden"
              >
                <span>Play as White</span>
                <span className="text-2xl">♔</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onSelect("BLACK")}
                className="group relative flex items-center justify-between px-6 py-4 rounded-2xl bg-[#0A0F2C] border border-[#3A6FF7]/20 text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg overflow-hidden"
              >
                <span>Play as Black</span>
                <span className="text-2xl">♚</span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => onSelect("RANDOM")}
                className="group relative flex items-center justify-between px-6 py-4 rounded-2xl bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg overflow-hidden"
              >
                <span>Random Side</span>
                <div className="flex gap-1">
                  <span className="text-xl">♔</span>
                  <span className="text-xl">♚</span>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
