import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Lock,
  Trophy,
  Award,
  Target,
  Flame,
  Medal,
  Star,
  Zap,
} from "lucide-react";

interface AchievementCardProps {
  title: string;
  description?: string;
  icon: string;
  isEarned: boolean;
  earnedAt?: string;
  criteriaType?: string;
  criteriaValue?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  isEarned,
  earnedAt,
}) => {
  const renderIcon = () => {
    const props = {
      size: 40,
      className: isEarned
        ? "text-yellow-400"
        : "text-gray-500 transition-all duration-700",
    };

    switch (icon.toLowerCase()) {
      case "trophy":
        return <Trophy {...props} />;
      case "award":
        return <Award {...props} />;
      case "target":
        return <Target {...props} />;
      case "flame":
        return <Flame {...props} />;
      case "medal":
        return <Medal {...props} />;
      case "star":
        return <Star {...props} />;
      case "zap":
        return <Zap {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <Tilt
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      perspective={1000}
      transitionSpeed={1500}
      scale={1.02}
      gyroscope={true}
      className="h-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className={`relative h-full p-6 rounded-2xl border transition-all duration-700 overflow-hidden flex flex-col ${
          isEarned
            ? "bg-gradient-to-br from-gray-900 via-gray-900 to-black border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.05)]"
            : "bg-black/20 border-gray-800/50 backdrop-blur-sm"
        }`}
      >
        {/* Shine Animation Layer */}
        {isEarned && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_4s_infinite]" />
          </div>
        )}

        <div className="flex flex-col items-center text-center gap-4 flex-grow">
          <div
            className={`p-5 rounded-3xl relative transition-all duration-700 ${
              isEarned
                ? "bg-yellow-500/10 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)]"
                : "bg-gray-800/30"
            }`}
          >
            {renderIcon()}
            {!isEarned && (
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-gray-900 rounded-full border border-gray-700 shadow-xl">
                <Lock size={12} className="text-gray-500" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3
              className={`text-lg font-bold tracking-tight ${isEarned ? "text-yellow-500" : "text-gray-400"}`}
            >
              {title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${isEarned ? "text-gray-400" : "text-gray-600"}`}
            >
              {description}
            </p>
          </div>
        </div>

        {isEarned && earnedAt && (
          <div className="mt-6 pt-4 border-t border-gray-800/50 w-full text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500/50 font-bold">
              Unlocked{" "}
              {new Date(earnedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </motion.div>
    </Tilt>
  );
};

export default AchievementCard;
