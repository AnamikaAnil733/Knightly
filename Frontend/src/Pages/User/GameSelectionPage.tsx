import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Timer, Clock, Trophy, ChevronLeft, Bot } from "lucide-react";
import { ColorSelectionModal } from "../../Components/User/Match/ColorSelectionModal";

export interface TimeControlOption {
  id: string; // The backend code, e.g., "1+0"
  label: string; // The display label, e.g., "1 | 0"
}

interface GameMode {
  id: string;
  name: string;
  duration: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  options: TimeControlOption[];
}

const gameModes: GameMode[] = [
  {
    id: "bullet",
    name: "Bullet",
    duration: "1-2 min",
    description: "Ultra-fast matches for quick thinkers.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-500 to-red-600",
    options: [
      { id: "1+0", label: "1 min" },
      { id: "2+1", label: "2 | 1" },
    ],
  },
  {
    id: "blitz",
    name: "Blitz",
    duration: "3-5 min",
    description: "The classic fast-paced chess experience.",
    icon: <Timer className="w-8 h-8" />,
    color: "from-yellow-400 to-orange-500",
    options: [
      { id: "3+0", label: "3 min" },
      { id: "3+2", label: "3 | 2" },
      { id: "5+0", label: "5 min" },
      { id: "5+3", label: "5 | 3" },
    ],
  },
  {
    id: "rapid",
    name: "Rapid",
    duration: "10-30 min",
    description: "Balanced time for strategy and speed.",
    icon: <Clock className="w-8 h-8" />,
    color: "from-emerald-400 to-teal-600",
    options: [
      { id: "10+0", label: "10 min" },
      { id: "15+10", label: "15 | 10" },
      { id: "20+0", label: "20 min" },
      { id: "30+0", label: "30 min" },
    ],
  },
  {
    id: "classical",
    name: "Classical",
    duration: "30-60 min",
    description: "Deep thinking and long-term strategy.",
    icon: <Trophy className="w-8 h-8" />,
    color: "from-blue-500 to-indigo-600",
    options: [
      { id: "30+10", label: "30 | 10" },
      { id: "45+0", label: "45 min" },
      { id: "60+0", label: "60 min" },
      { id: "45+15", label: "45 | 15" },
    ],
  },
  {
    id: "computer",
    name: "Play Computer",
    duration: "Untimed / Any",
    description: "Challenge the Stockfish engine.",
    icon: <Bot className="w-8 h-8" />,
    color: "from-purple-500 to-fuchsia-600",
    options: [
      { id: "level-1", label: "Level 1" },
      { id: "level-2", label: "Level 2" },
      { id: "level-3", label: "Level 3" },
      { id: "level-4", label: "Level 4" },
      { id: "level-5", label: "Level 5" },
      { id: "level-6", label: "Level 6" },
    ],
  },
];

export function GameSelectionPage() {
  const navigate = useNavigate();
  const [selectedBotLevel, setSelectedBotLevel] = React.useState<{ id: string; label: string } | null>(null);

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
              className="group relative cursor-pointer"
              onClick={() => {
                const firstOption = mode.options[0];
                if (mode.id === "computer") {
                  setSelectedBotLevel(firstOption);
                } else {
                  navigate("/waiting", { state: { format: firstOption.id, modeName: mode.name } });
                }
              }}
            >
              {/* Card Background with Glassmorphism */}
              <div className="h-full p-8 rounded-3xl bg-[#11193F]/40 backdrop-blur-xl border border-white/5 group-hover:border-[#3A6FF7]/30 transition-all duration-300 relative overflow-hidden flex flex-col">
                {/* Hover Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
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

                <p className="text-[#C9CAD9] text-sm leading-relaxed mb-6 flex-grow">
                  {mode.description}
                </p>

                {/* Specific Time Control Options */}
                <div className="grid grid-cols-2 gap-2 mt-auto relative z-20">
                  {mode.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (mode.id === "computer") {
                          setSelectedBotLevel(option);
                        } else {
                          navigate("/waiting", { state: { format: option.id, modeName: mode.name } });
                        }
                      }}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 hover:bg-[#3A6FF7] hover:border-[#3A6FF7] hover:text-white transition-all duration-200"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative Glow */}
              <div
                className={`absolute -inset-[1px] bg-gradient-to-br ${mode.color} rounded-3xl blur-[12px] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}
              />
            </motion.div>
          ))}
        </motion.div>

        <ColorSelectionModal
          isOpen={!!selectedBotLevel}
          onClose={() => setSelectedBotLevel(null)}
          levelLabel={selectedBotLevel?.label || ""}
          onSelect={(color) => {
            if (selectedBotLevel) {
              navigate("/waiting", { 
                state: { 
                  format: selectedBotLevel.id, 
                  modeName: "Play Computer",
                  preferredColor: color 
                } 
              });
              setSelectedBotLevel(null);
            }
          }}
        />

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
