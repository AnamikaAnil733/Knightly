import React from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LikeButtonProps {
  likes: string[];
  userId: string | undefined;
  onToggle: () => void;
  loading?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  likes,
  userId,
  onToggle,
  loading = false,
}) => {
  const isLiked = userId ? likes.includes(userId) : false;
  const count = likes.length;

  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        disabled={loading}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
          isLiked
            ? "bg-red-500/10 border-red-500/20"
            : "bg-white/5 border-white/10 hover:border-red-500/40"
        } border`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-300 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 group-hover:text-red-500"
              }`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Pulsing glow when liked */}
        {isLiked && (
          <motion.div
            layoutId="glow"
            className="absolute inset-0 rounded-full bg-red-500/20 blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>

      <div className="flex flex-col">
        <span
          className={`text-sm font-bold font-cinzel tracking-wider ${isLiked ? "text-red-500" : "text-white"}`}
        >
          {count}
        </span>
        <span className="text-[10px] uppercase text-gray-500 tracking-widest font-bold">
          {count === 1 ? "Endorsement" : "Endorsements"}
        </span>
      </div>
    </div>
  );
};
