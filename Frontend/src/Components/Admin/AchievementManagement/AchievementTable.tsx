import { Trophy, Flame, Target, Zap, Star, Shield, Crown, Award } from "lucide-react";
import type { Achievement } from "../../../Service/Api/AdminAchievementApi";

/* ─── Icon resolver ─────────────────────────────────────── */
const IconMap: Record<string, React.ElementType> = {
  Trophy, Flame, Target, Zap, Star, Shield, Crown, Award,
};

const CRITERIA_LABELS: Record<string, string> = {
  GAMES_WON:      "Games Won",
  GAMES_PLAYED:   "Games Played",
  PUZZLES_SOLVED: "Puzzles Solved",
  STREAK_DAYS:    "Streak Days",
};

const CRITERIA_COLORS: Record<string, string> = {
  GAMES_WON:      "text-[#FFD166] bg-[#FFD166]/10 border-[#FFD166]/30",
  GAMES_PLAYED:   "text-[#3A6FF7] bg-[#3A6FF7]/10 border-[#3A6FF7]/30",
  PUZZLES_SOLVED: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  STREAK_DAYS:    "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

interface Props {
  achievements: Achievement[];
  loading:      boolean;
}

export function AchievementTable({ achievements, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0A0F2C]/60 overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#3A6FF7] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0A0F2C]/60 overflow-hidden">
        <div className="p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B2EFF]/20 to-[#3A6FF7]/20
                          flex items-center justify-center border border-white/10">
            <Trophy size={28} className="text-gray-500" />
          </div>
          <div>
            <p className="text-white font-medium">No achievements yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Achievement" to create your first one.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A0F2C]/60 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[48px_1fr_160px_140px_80px] items-center
                      px-5 py-3 border-b border-white/10 bg-white/5">
        <span />
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Achievement</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Criteria</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Target</span>
        <span />
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {achievements.map((a) => {
          const IconComponent = IconMap[a.icon] ?? Trophy;
          const colorClass    = CRITERIA_COLORS[a.criteriaType] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30";

          return (
            <div
              key={a.id}
              className="grid grid-cols-[48px_1fr_160px_140px_80px] items-center
                         px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center
                              bg-gradient-to-br from-[#6B2EFF]/30 to-[#3A6FF7]/30
                              border border-white/10 group-hover:border-[#FFD166]/30
                              transition-colors">
                <IconComponent size={18} className="text-[#FFD166]" />
              </div>

              {/* Title + Description */}
              <div className="pl-3 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{a.description}</p>
              </div>

              {/* Criteria type badge */}
              <div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                  {CRITERIA_LABELS[a.criteriaType] ?? a.criteriaType}
                </span>
              </div>

              {/* Target value */}
              <div className="text-center">
                <span className="text-sm font-bold text-white">{a.criteriaValue}</span>
              </div>

              {/* Actions placeholder */}
              <div />
            </div>
          );
        })}
      </div>
    </div>
  );
}
