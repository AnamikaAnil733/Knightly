import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flame,
  Sparkles,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeepPracticing: () => void;
  streakCount: number;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  onKeepPracticing,
  streakCount,
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#070B1D]/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative w-full max-w-sm bg-[#0B1437] rounded-[2.5rem] border border-[#FFD166]/30 shadow-[0_0_50px_rgba(255,209,102,0.15)] overflow-hidden"
          >
            {/* Animated Glow Backdrop */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFD166]/10 blur-[80px] -z-10 rounded-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group z-20"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </button>

            <div className="p-8 pt-12 flex flex-col items-center text-center">
              {/* Flame Animation */}
              <div className="relative mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD166] via-[#F4C430] to-[#fff] p-0.5 shadow-[0_0_30px_rgba(255,209,102,0.4)]">
                    <div className="w-full h-full rounded-full bg-[#0B1437] flex items-center justify-center">
                      <Flame className="w-12 h-12 text-[#FFD166] fill-[#FFD166]/20" />
                    </div>
                  </div>
                </motion.div>

                {/* Particles */}
                <motion.div
                  animate={{ opacity: [0, 1, 0], y: [-20, -40] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-0 right-0"
                >
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                </motion.div>
              </div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-sm font-bold tracking-[0.2em] text-[#FFD166] uppercase mb-2">
                  Challenge Complete
                </h2>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">
                  {streakCount} Day Streak!
                </h3>
                <p className="text-gray-400 text-base leading-relaxed px-4">
                  Your daily puzzle streak is on fire. Consistency is the secret
                  to mastery!
                </p>
              </motion.div>

              {/* Stats Preview */}
              <div className="w-full mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">
                    Next Goal
                  </p>
                  <p className="text-white font-bold">
                    {Math.ceil((streakCount + 1) / 5) * 5} Days
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">
                    Rank
                  </p>
                  <p className="text-white font-bold">Tactician</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 mt-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onKeepPracticing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD166] to-[#F4C430] text-[#0B1437] font-black text-lg shadow-[0_10px_20px_rgba(255,209,102,0.2)] flex items-center justify-center gap-2 group"
                >
                  Keep Practicing
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <button
                  onClick={() => navigate("/puzzles")}
                  className="w-full py-4 rounded-2xl bg-white/5 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#FFD166]/50 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
