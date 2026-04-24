import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import {
  getSolveCount,
  fetchSolveHistory,
} from "../../Service/Api/UserPuzzleApi";
import { StreakCalendar } from "../../Components/User/Puzzle/StreakCalendar";
import { DifficultyLevel } from "../../Types/PuzzleTypes";

import {
  ChevronLeft,
  Zap,
  Target,
  Trophy,
  Flame,
  Lightbulb,
  ShieldCheck,
  Calendar,
  Sparkles,
  X,
} from "lucide-react";
import {
  getDailyDifficulty,
  getTodayLabel,
  isTodaysDifficulty,
} from "../../Utils/GetDailyDifficulty";

const levels: DifficultyLevel[] = [
  {
    id: "easy",
    name: "Easy",
    description:
      "Perfect for warming up. Focus on one-move mates and basic hanging pieces.",
    icon: Lightbulb,
    color: "from-emerald-400 to-cyan-500",
    ratingRange: "0 - 1000",
    accent: "text-emerald-400",
    tasks: "1000+ Puzzles",
  },
  {
    id: "medium",
    name: "Medium",
    description:
      "Common tactical patterns like forks, pins, and skewers. Build your pattern recognition.",
    icon: ShieldCheck,
    color: "from-blue-500 to-indigo-600",
    ratingRange: "1000 - 1500",
    accent: "text-blue-400",
    tasks: "2500+ Puzzles",
  },
  {
    id: "hard",
    name: "Hard",
    description:
      "Complex combinations and multi-move sequences. Requires deep calculation.",
    icon: Zap,
    color: "from-orange-500 to-red-600",
    ratingRange: "1500 - 2000",
    accent: "text-orange-400",
    tasks: "1500+ Puzzles",
  },
  {
    id: "expert",
    name: "Expert",
    description:
      "Grandmaster level challenges. Only the sharpest minds survive these depths.",
    icon: Trophy,
    color: "from-blue-600 to-red-600",
    ratingRange: "2000+",
    accent: "text-purple-400",
    tasks: "500+ Puzzles",
  },
];

import { PremiumModal } from "../../Components/User/Puzzle/PremiumModal";

export function PuzzleTactics() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const [solveCount, setSolveCount] = useState<number>(0);
  const [totalSolveCount, setTotalSolveCount] = useState<number>(0);
  const [, setIsLoadingCount] = useState(true);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [solveHistory, setSolveHistory] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const todayDifficulty = getDailyDifficulty();
  const todayLabel = getTodayLabel();
  const todayConfig = levels.find((l) => l.id === todayDifficulty)!;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getSolveCount();
        if (data.success) {
          setSolveCount(data.today);
          setTotalSolveCount(data.total);
        }
      } catch (err) {
        console.error("Failed to fetch solve count:", err);
      } finally {
        setIsLoadingCount(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await fetchSolveHistory();
        if (response.success) {
          setSolveHistory(response.history);
        }
      } catch (err) {
        console.error("Failed to fetch solve history:", err);
      }
    };

    fetchCount();
    fetchHistory();
  }, []);

  const PUZZLE_LIMIT = 5;
  const isLimited = !user?.premium && solveCount >= PUZZLE_LIMIT;

  const handleStartPuzzle = (difficulty: string) => {
    if (!user?.premium && solveCount >= PUZZLE_LIMIT) {
      setIsPremiumModalOpen(true);
      return;
    }
    navigate(`/puzzle/solve/${difficulty}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="h-screen bg-[#0A0F2C] text-white relative overflow-hidden font-['Inter'] flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#3A6FF7]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#6B2EFF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-4 lg:py-6 relative z-10 w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="mb-6 lg:mb-8 flex items-center justify-between shrink-0">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/landing-page")}
            className="flex items-center gap-2 text-[#C9CAD9] hover:text-white transition-all group px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Dashboard</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-[#FFD166]/20 to-transparent px-4 py-2 rounded-full border border-[#FFD166]/30 shadow-[0_0_15px_rgba(255,209,102,0.1)] cursor-pointer hover:bg-[#FFD166]/30 transition-all active:scale-95 group/streak"
          >
            <Flame className="w-5 h-5 text-[#FFD166] fill-[#FFD166] group-hover/streak:animate-bounce" />
            <span className="text-[#FFD166] font-bold text-sm">
              Daily Streak: {user?.currentStreak || 0} Days
            </span>
          </motion.div>
        </header>

        {/* Top Section: Hero + Calendar */}
        {/* Hero Section */}
        <div className="text-left mb-6 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A6FF7]/20 border border-[#3A6FF7]/30 text-[#3A6FF7] text-[10px] font-bold mb-3 tracking-wider uppercase"
          >
            <Target className="w-3 h-3" />
            Tactical Training • {totalSolveCount} Solved
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-white via-white to-[#FFD166] bg-clip-text text-transparent tracking-tight leading-[1.1]"
          >
            Tactical Masterclass
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C9CAD9] text-sm lg:text-base leading-relaxed opacity-70 max-w-xl"
          >
            Sharpen your vision and master the art of the endgame.
          </motion.p>
        </div>

        {/* Today's Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 shrink-0"
        >
          <div
            className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-r ${todayConfig.color} p-[1px]`}
          >
            <div className="bg-[#0A0F2C]/90 backdrop-blur-2xl rounded-[2rem] p-5 lg:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${todayConfig.color} flex items-center justify-center shadow-2xl shadow-black/40 animate-pulse`}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles className="w-3 h-3 text-[#FFD166]" />
                    <span className="text-[9px] font-bold text-[#FFD166] uppercase tracking-widest">
                      Today's Challenge
                    </span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white">
                    {todayLabel} —{" "}
                    <span className={todayConfig.accent}>
                      {todayConfig.name}
                    </span>
                  </h3>
                  <p className="text-[#C9CAD9] text-[10px] mt-0.5 opacity-80">
                    {!user?.premium && (
                      <span className="text-[#FFD166] font-bold">
                        Progress: {solveCount}/{PUZZLE_LIMIT} puzzles
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={!isLimited ? { scale: 1.05 } : {}}
                whileTap={!isLimited ? { scale: 0.95 } : {}}
                onClick={() => handleStartPuzzle("daily")}
                className={`px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-black/30 transition-all whitespace-nowrap ${
                  isLimited
                    ? "bg-gray-700/50 text-gray-500 cursor-not-allowed border border-white/5"
                    : `bg-gradient-to-r ${todayConfig.color} text-white hover:shadow-xl hover:shadow-black/40`
                }`}
              >
                {isLimited ? "Limit Reached" : "Start Today's Puzzle"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Levels Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0"
        >
          {levels.map((level) => (
            <motion.div
              key={level.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div
                className={`flex flex-col p-5 lg:p-6 rounded-[1.5rem] bg-[#11193F]/40 backdrop-blur-2xl border transition-all duration-500 relative overflow-hidden ${
                  isTodaysDifficulty(level.id)
                    ? "border-[#FFD166]/40 ring-1 ring-[#FFD166]/20 group-hover:border-[#FFD166]/60"
                    : "border-white/5 group-hover:border-[#3A6FF7]/40"
                }`}
              >
                {isTodaysDifficulty(level.id) && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFD166]/20 border border-[#FFD166]/30 z-10">
                    <span className="text-[9px] font-bold text-[#FFD166] uppercase tracking-widest">
                      Today
                    </span>
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-6 shadow-2xl shadow-black/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shrink-0`}
                >
                  <level.icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="text-xl font-bold group-hover:text-white transition-colors">
                      {level.name}
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 whitespace-nowrap ${level.accent}`}
                    >
                      {level.ratingRange}
                    </span>
                  </div>

                  <p className="text-[#C9CAD9] text-[11px] leading-relaxed mb-4 opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
                    {level.description}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-[10px]">
                      <Flame className="w-3 h-3 text-[#FFD166]" />
                      <span>{level.tasks}</span>
                    </div>
                    <motion.button
                      whileTap={!isLimited ? { scale: 0.95 } : {}}
                      onClick={() => handleStartPuzzle(level.id)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold shadow-lg transition-all uppercase tracking-tight ${
                        isLimited
                          ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                          : `bg-gradient-to-r ${level.color} text-white shadow-black/20 hover:shadow-black/40`
                      }`}
                    >
                      {isLimited ? "Locked" : "Solve"}
                    </motion.button>
                  </div>
                </div>
              </div>

              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem] px-4`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Compact Footer Branding */}
      <div className="py-4 text-center shrink-0">
        <p className="text-[#C9CAD9]/20 text-[8px] tracking-[0.3em] font-medium uppercase">
          Knightly Tactical Engine • v2.4.0
        </p>
      </div>

      <AnimatePresence>
        {isCalendarOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalendarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0F2C] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FFD166]/10 border border-[#FFD166]/20">
                      <Flame className="w-5 h-5 text-[#FFD166]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Monthly Activity</h2>
                      <p className="text-xs text-[#C9CAD9]/50">
                        Your tactical consistency
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#11193F]/40 rounded-[2rem] border border-white/5 overflow-hidden p-6 lg:p-8">
                  <StreakCalendar
                    history={solveHistory}
                    showCurrentMonthOnly={true}
                    hideHeader={true}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
}
