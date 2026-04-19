import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Star, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  message = "You've reached your daily limit for puzzles. Upgrade to Premium to unlock unlimited puzzles and master your tactics!",
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
            className="absolute inset-0 bg-[#0B1437]/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-lg bg-[#0B1437] rounded-3xl border border-[#4F7CFF]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {/* Header Ornament */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FFD166] to-transparent opacity-60" />

            <div className="p-10 flex flex-col items-center text-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 transition-colors group"
              >
                <X className="w-5 h-5 text-[#AAB3D1] group-hover:text-white" />
              </button>

              {/* Royal Icon */}
              <div className="relative mb-6">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-full bg-gradient-to-b from-[#1A1F4F] to-[#0B1437] border border-[#FFD166]/30 flex items-center justify-center shadow-2xl relative z-10"
                >
                  <Crown className="w-10 h-10 text-[#FFD166] drop-shadow-[0_0_10px_rgba(255,209,102,0.5)]" />
                </motion.div>
                <div className="absolute -inset-4 bg-[#4F7CFF]/10 blur-2xl rounded-full" />
              </div>

              <h3
                className="text-3xl mb-3 font-cinzel leading-tight"
                style={{
                  fontFamily: "'Cinzel', serif",
                  background: "linear-gradient(to bottom, #fff, #FFD166)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Claim Your Throne
              </h3>

              <p className="text-[#AAB3D1] text-base font-light leading-relaxed mb-8 max-w-[320px]">
                {message}
              </p>

              {/* Benefits List */}
              <div className="w-full space-y-4 mb-10 text-left bg-white/5 p-6 rounded-2xl border border-white/5">
                {[
                  { text: "Unlimited Puzzles & Solutions", icon: Crown },
                  { text: "Advanced Game Analysis", icon: Star },
                  { text: "Exclusive Master Lessons", icon: BookOpen },
                  { text: "Personalized Learning Paths", icon: Sparkles },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FFD166]/10 flex items-center justify-center shrink-0 border border-[#FFD166]/20">
                      <item.icon className="w-3.5 h-3.5 text-[#FFD166]" />
                    </div>
                    <span className="text-sm font-medium text-white/90 tracking-wide">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-4 rounded-full text-lg font-bold tracking-[0.05em] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                style={{
                  background: "linear-gradient(to right, #4F7CFF, #6D5DF6)",
                  color: "#fff",
                  boxShadow: "0 10px 25px rgba(79,124,255,0.3)",
                }}
              >
                BEGIN YOUR REIGN
              </button>

              <button
                onClick={onClose}
                className="mt-5 text-[#AAB3D1] text-xs font-semibold tracking-widest uppercase hover:text-white transition-colors"
              >
                Dismiss Appeal
              </button>
            </div>

            {/* Bottom Ornament */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4F7CFF] to-transparent opacity-20" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
