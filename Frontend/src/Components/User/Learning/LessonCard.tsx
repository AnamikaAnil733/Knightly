import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";

interface LessonCardProps {
  id: string;
  title: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  order: number;
  category: string;
  isPremium?: boolean;
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
  isPremium,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const d = DIFF_COLORS[difficulty] ?? DIFF_COLORS.BEGINNER;

  const handleClick = () => {
    if (isPremium && (!user || !user.premium)) {
      alert("This is a Premium Lesson. Upgrade to Knightly Premium to access all master lessons!");
      navigate("/pricing");
      return;
    }
    navigate(`/learn/lesson/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full group flex items-center justify-between border rounded-xl p-5 transition-all duration-200 ${
        isPremium && !user?.premium
          ? "bg-[#11193F]/50 border-white/5 opacity-80"
          : "bg-[#11193F] border-white/5 hover:border-[#FFD166]/30 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
          isPremium && !user?.premium 
            ? "bg-white/5 text-gray-600" 
            : "bg-white/5 text-[#9ca3af] group-hover:bg-[#FFD166]/10 group-hover:text-[#FFD166]"
        }`}>
          {order}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <p className={`font-bold transition-colors ${
              isPremium && !user?.premium ? "text-gray-500" : "text-white group-hover:text-[#FFD166]"
            }`}>
              {title}
            </p>
            {isPremium && (
              <Lock className={`w-3.5 h-3.5 ${user?.premium ? "text-green-500" : "text-amber-500 fill-amber-500/10"}`} />
            )}
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${d.bg} mt-1 inline-block`}
            style={{ color: d.color }}
          >
            {d.label}
          </span>
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 transition-colors flex-shrink-0 ${
        isPremium && !user?.premium ? "text-white/5" : "text-white/20 group-hover:text-[#FFD166]"
      }`} />
    </button>
  );
};

export default LessonCard;
