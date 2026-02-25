import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Brain, 
  Zap, 
  Target, 
  Trophy, 
  Star,
  Flame,
  Lightbulb,
  ShieldCheck,
  Calendar,
  Sparkles
} from "lucide-react";
import { getDailyDifficulty, getTodayLabel, isTodaysDifficulty } from "../../Utils/GetDailyDifficulty";

interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  ratingRange: string;
  accent: string;
  tasks: string;
}

const levels: DifficultyLevel[] = [
  {
    id: "easy",
    name: "Easy",
    description: "Perfect for warming up. Focus on one-move mates and basic hanging pieces.",
    icon: Lightbulb,
    color: "from-emerald-400 to-cyan-500",
    ratingRange: "0 - 1000",
    accent: "text-emerald-400",
    tasks: "1000+ Puzzles"
  },
  {
    id: "medium",
    name: "Medium",
    description: "Common tactical patterns like forks, pins, and skewers. Build your pattern recognition.",
    icon: ShieldCheck,
    color: "from-blue-500 to-indigo-600",
    ratingRange: "1000 - 1500",
    accent: "text-blue-400",
    tasks: "2500+ Puzzles"
  },
  {
    id: "hard",
    name: "Hard",
    description: "Complex combinations and multi-move sequences. Requires deep calculation.",
    icon: Zap,
    color: "from-orange-500 to-red-600",
    ratingRange: "1500 - 2000",
    accent: "text-orange-400",
    tasks: "1500+ Puzzles"
  },
  {
    id: "expert",
    name: "Expert",
    description: "Grandmaster level challenges. Only the sharpest minds survive these depths.",
    icon: Trophy,
    color: "from-blue-600 to-red-600",
    ratingRange: "2000+",
    accent: "text-purple-400",
    tasks: "500+ Puzzles"
  },
];

export function PuzzleTactics() {
  const navigate = useNavigate();
  const todayDifficulty = getDailyDifficulty();
  const todayLabel = getTodayLabel();
  const todayConfig = levels.find(l => l.id === todayDifficulty)!;

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
        damping: 12
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white relative overflow-hidden font-['Inter']">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#3A6FF7]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#6B2EFF]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/landing-page")}
            className="flex items-center gap-2 text-[#C9CAD9] hover:text-white transition-all group px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Dashboard</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-gradient-to-r from-[#FFD166]/20 to-transparent px-4 py-2 rounded-full border border-[#FFD166]/30"
          >
            <Star className="w-5 h-5 text-[#FFD166] fill-[#FFD166]" />
            <span className="text-[#FFD166] font-bold">Daily Streak: 5 Days</span>
          </motion.div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A6FF7]/20 border border-[#3A6FF7]/30 text-[#3A6FF7] text-sm font-bold mb-6 tracking-wider uppercase"
          >
            <Target className="w-4 h-4" />
            Tactical Training
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-[#FFD166] bg-clip-text text-transparent font-['Poppins'] tracking-tight"
          >
            Puzzle Tactics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C9CAD9] text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Sharpen your vision and master the art of the endgame. Select a difficulty level and start solving.
          </motion.p>
        </div>

        {/* Today's Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16 relative"
        >
          <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-r ${todayConfig.color} p-[1px]`}>
            <div className="bg-[#0A0F2C]/90 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${todayConfig.color} flex items-center justify-center shadow-2xl shadow-black/40 animate-pulse`}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-[#FFD166]" />
                    <span className="text-xs font-bold text-[#FFD166] uppercase tracking-widest">Today's Challenge</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {todayLabel} — <span className={todayConfig.accent}>{todayConfig.name}</span> Difficulty
                  </h3>
                  <p className="text-[#C9CAD9] text-sm mt-1 opacity-80">
                    Difficulty rotates daily. Come back each day for a fresh challenge!
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/puzzle/solve/${todayDifficulty}`)}
                className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${todayConfig.color} text-white font-bold text-base shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 transition-all whitespace-nowrap`}
              >
                Start Today's Puzzle
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Levels Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {levels.map((level) => (
            <motion.div
              key={level.id}
              variants={cardVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className="group relative h-full"
            >
              {/* Card Container */}
              <div className={`h-full flex flex-col p-8 rounded-[2rem] bg-[#11193F]/40 backdrop-blur-2xl border transition-all duration-500 relative overflow-hidden ${
                isTodaysDifficulty(level.id)
                  ? 'border-[#FFD166]/40 ring-1 ring-[#FFD166]/20 group-hover:border-[#FFD166]/60'
                  : 'border-white/5 group-hover:border-[#3A6FF7]/40'
              }`}>
                
                {/* TODAY Badge */}
                {isTodaysDifficulty(level.id) && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFD166]/20 border border-[#FFD166]/30 z-10">
                    <Sparkles className="w-3 h-3 text-[#FFD166]" />
                    <span className="text-[10px] font-bold text-[#FFD166] uppercase tracking-widest">Today</span>
                  </div>
                )}

                {/* Background Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${level.color} ${isTodaysDifficulty(level.id) ? 'opacity-10' : 'opacity-0'} group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

                {/* Level Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-8 shadow-2xl shadow-black/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <level.icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold group-hover:text-white transition-colors">
                      {level.name}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 ${level.accent}`}>
                      {level.ratingRange}
                    </span>
                  </div>
                  
                  <p className="text-[#C9CAD9] text-sm leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                    {level.description}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between py-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Flame className="w-3 h-3 text-[#FFD166]" />
                      <span>{level.tasks}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/puzzle/solve/${level.id}`)}
                      className={`px-4 py-2 rounded-lg bg-gradient-to-r ${level.color} text-white text-xs font-bold shadow-lg shadow-black/20 hover:shadow-black/40 transition-all`}
                    >
                      Start Solving
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Outer Shadow Effect */}
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-[2rem] px-4`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section / Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 p-12 rounded-[2.5rem] bg-gradient-to-r from-[#11193F]/60 to-[#1B1452]/60 backdrop-blur-3xl border border-white/10 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#3A6FF7]/10 to-transparent pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 font-['Poppins']">Master the Board</h2>
              <p className="text-[#C9CAD9] mb-8 leading-relaxed">
                Consistent practice is the key to rising in the ranks. Our puzzles are curated from thousands of real matches, helping you recognize winning patterns instantly.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-[#FFD166]">15,400+</div>
                  <div className="text-sm text-[#C9CAD9]">Puzzles Solved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#3A6FF7]">184</div>
                  <div className="text-sm text-[#C9CAD9]">Active Solvers</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] flex items-center justify-center shadow-[0_0_50px_rgba(58,111,247,0.3)] animate-bounce-slow">
                  <Brain className="w-24 h-24 text-white" />
                </div>
                {/* Decorative particles */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFD166] rounded-full blur-lg animate-pulse" />
                <div className="absolute -bottom-8 left-12 w-12 h-12 bg-[#6B2EFF] rounded-full blur-xl animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Branding */}
      <div className="py-12 text-center border-t border-white/5 mt-12">
        <p className="text-[#C9CAD9]/30 text-xs tracking-[0.2em] font-medium uppercase">
          Knightly Tactical Engine • v2.4.0
        </p>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
