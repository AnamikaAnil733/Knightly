import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Timer, Clock, Trophy, ChevronLeft } from "lucide-react";

interface GameMode {
  id: string;
  name: string;
  duration: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const gameModes: GameMode[] = [
  {
    id: "bullet",
    name: "Bullet",
    duration: "1 min",
    description: "Ultra-fast matches for quick thinkers.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-500 to-red-600",
  },
  {
    id: "blitz",
    name: "Blitz",
    duration: "3 - 5 min",
    description: "The classic fast-paced chess experience.",
    icon: <Timer className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "rapid",
    name: "Rapid",
    duration: "10 - 15 min",
    description: "Balanced time for strategy and speed.",
    icon: <Clock className="w-8 h-8" />,
    color: "from-emerald-400 to-teal-600",
  },
  {
    id: "classical",
    name: "Classical",
    duration: "30+ min",
    description: "Deep thinking and long-term strategy.",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600",
  },
];

export function GameSelectionPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] text-white relative overflow-hidden font-['Inter']">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3A6FF7]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#6B2EFF]/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <header className="mb-16 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/landing-page")}
            className="flex items-center gap-2 text-[#C9CAD9] hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </motion.button>
        </header>

        {/* Title Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[#FFD166] bg-clip-text text-transparent font-['Poppins']"
          >
            Choose Your Battle
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#C9CAD9] text-lg max-w-2xl mx-auto"
          >
            Select a time control that suits your playstyle. From lightning fast
            bullet to deep classical strategy.
          </motion.p>
        </div>

        {/* Game Modes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {gameModes.map((mode) => (
            <motion.div
              key={mode.id}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate("/waiting")}
              className="group relative cursor-pointer"
            >
              {/* Card Background with Glassmorphism */}
              <div className="h-full p-8 rounded-3xl bg-[#11193F]/40 backdrop-blur-xl border border-white/5 group-hover:border-[#3A6FF7]/50 transition-all duration-300 relative overflow-hidden">
                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {mode.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FFD166] transition-colors">
                  {mode.name}
                </h3>

                <div className="flex items-center gap-2 mb-4 text-[#FFD166]/80 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>{mode.duration}</span>
                </div>

                <p className="text-[#C9CAD9] text-sm leading-relaxed mb-6">
                  {mode.description}
                </p>

                {/* Bottom Action Hint */}
                <div className="flex items-center gap-2 text-[#3A6FF7] font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Start Match</span>
                  <div className="w-5 h-[2px] bg-[#3A6FF7]" />
                </div>
              </div>

              {/* Decorative Glow */}
              <div
                className={`absolute -inset-[1px] bg-gradient-to-br ${mode.color} rounded-3xl blur-[12px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center border-t border-white/5 pt-8"
        >
          <p className="text-[#C9CAD9]/40 text-sm">
            Knightly Matchmaking • Fair Play Certified • Global Rankings
          </p>
        </motion.div>
      </div>
    </div>
  );
}
