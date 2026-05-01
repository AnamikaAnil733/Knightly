import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  userAchievementApi,
  AchievementProgress,
} from "../../../Service/Api/UserAchievementApi";
import AchievementCard from "./AchievementCard";

interface AchievementSectionProps {
  isCompact?: boolean;
}

export const AchievementSection: React.FC<AchievementSectionProps> = ({
  isCompact = false,
}) => {
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await userAchievementApi.getAllAchievements();
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin text-yellow-500 w-6 h-6" />
      </div>
    );

  const displayedAchievements = isCompact
    ? achievements.filter((a) => a.isEarned).slice(0, 3)
    : achievements;

  if (displayedAchievements.length === 0 && isCompact) {
    return (
      <p className="text-gray-600 text-[10px] uppercase font-bold italic">
        No badges earned yet.
      </p>
    );
  }

  if (achievements.length === 0) return null;

  if (isCompact) {
    return (
      <div className="flex gap-4">
        {displayedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="w-12 h-12 bg-[#3a3a3a] rounded-lg flex items-center justify-center border border-white/5 shadow-lg group relative"
          >
            {/* Minimalist icon representation for compact view */}
            <div className="text-white/40 group-hover:text-yellow-500 transition-colors">
              <AchievementCardIcon icon={achievement.icon} size={20} />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[9px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {achievement.title}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#111827] p-8 md:p-12 rounded-[1.5rem] border border-white/5 shadow-2xl mt-12">
      <h2 className="text-[#FFD166] text-xl font-bold mb-10 tracking-wider uppercase">
        Achievements
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            isEarned={achievement.isEarned}
            earnedAt={achievement.earnedAt}
            criteriaType={achievement.criteriaType}
            criteriaValue={achievement.criteriaValue}
          />
        ))}
      </div>
    </div>
  );
};

// Internal helper for icons
import {
  Crown,
  Trophy,
  Flame,
  Target,
  Zap,
  Shield,
  Sword,
  Search,
  Star,
  Medal,
  Award,
} from "lucide-react";
const AchievementCardIcon = ({
  icon,
  size,
}: {
  icon: string;
  size: number;
}) => {
  const props = { size, strokeWidth: 1.5 };
  switch (icon.toLowerCase()) {
    case "king":
      return <Crown {...props} />;
    case "queen":
      return <Crown {...props} />;
    case "rook":
      return <Shield {...props} />;
    case "bishop":
      return <Medal {...props} />;
    case "knight":
      return <Award {...props} />;
    case "trophy":
      return <Trophy {...props} />;
    case "flame":
      return <Flame {...props} />;
    case "target":
      return <Target {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "sword":
      return <Sword {...props} />;
    case "search":
      return <Search {...props} />;
    default:
      return <Star {...props} />;
  }
};
