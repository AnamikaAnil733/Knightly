import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface LessonCardProps {
  id: string;
  title: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  order: number;
  category: string;
}

const DIFF_COLORS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  BEGINNER: { label: "Beginner", color: "#06D6A0", bg: "bg-[#06D6A0]/10" },
  INTERMEDIATE: {
    label: "Intermediate",
    color: "#FFD166",
    bg: "bg-[#FFD166]/10",
  },
  ADVANCED: { label: "Advanced", color: "#EF476F", bg: "bg-[#EF476F]/10" },
};

const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  difficulty,
  order,
}) => {
  const navigate = useNavigate();
  const d = DIFF_COLORS[difficulty] ?? DIFF_COLORS.BEGINNER;

  return (
    <button
      onClick={() => navigate(`/learn/lesson/${id}`)}
      className="w-full group flex items-center justify-between bg-[#11193F] border border-white/5 hover:border-[#FFD166]/30 rounded-xl p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#9ca3af] font-black text-sm group-hover:bg-[#FFD166]/10 group-hover:text-[#FFD166] transition-all">
          {order}
        </div>
        <div className="text-left">
          <p className="text-white font-bold group-hover:text-[#FFD166] transition-colors">
            {title}
          </p>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${d.bg} mt-1 inline-block`}
            style={{ color: d.color }}
          >
            {d.label}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#FFD166] transition-colors flex-shrink-0" />
    </button>
  );
};

export default LessonCard;
