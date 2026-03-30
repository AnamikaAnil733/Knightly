import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import { BookOpen, Sword, Crown, Layers, Flag } from "lucide-react";

const CATEGORIES = [
  {
    id: "GETTING_STARTED",
    label: "Getting Started",
    description:
      "Learn the rules: piece movements, board setup, check & checkmate.",
    icon: Flag,
    color: "#06D6A0",
    bg: "from-[#06D6A0]/20 to-[#06D6A0]/5",
    border: "border-[#06D6A0]/30 hover:border-[#06D6A0]",
    lessons: "8 lessons",
  },
  {
    id: "TACTICS",
    label: "Tactics",
    description:
      "Forks, pins, skewers, discovered attacks, and back-rank mates.",
    icon: Sword,
    color: "#EF476F",
    bg: "from-[#EF476F]/20 to-[#EF476F]/5",
    border: "border-[#EF476F]/30 hover:border-[#EF476F]",
    lessons: "12 lessons",
  },
  {
    id: "OPENINGS",
    label: "Openings",
    description:
      "Master key openings: Ruy Lopez, Sicilian, Italian, King's Indian.",
    icon: BookOpen,
    color: "#FFD166",
    bg: "from-[#FFD166]/20 to-[#FFD166]/5",
    border: "border-[#FFD166]/30 hover:border-[#FFD166]",
    lessons: "10 lessons",
  },
  {
    id: "STRATEGY",
    label: "Strategy",
    description:
      "Understand pawn structure, piece activity, center control & outposts.",
    icon: Layers,
    color: "#118AB2",
    bg: "from-[#118AB2]/20 to-[#118AB2]/5",
    border: "border-[#118AB2]/30 hover:border-[#118AB2]",
    lessons: "9 lessons",
  },
  {
    id: "ENDGAMES",
    label: "Endgames",
    description: "K+Q vs K, K+R vs K, pawn endgames, and the opposition.",
    icon: Crown,
    color: "#A78BFA",
    bg: "from-[#A78BFA]/20 to-[#A78BFA]/5",
    border: "border-[#A78BFA]/30 hover:border-[#A78BFA]",
    lessons: "7 lessons",
  },
];

const LearnPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#FFD166]/10 border border-[#FFD166]/20 text-[#FFD166] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Chess Academy
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Master the Game of{" "}
              <span className="bg-gradient-to-r from-[#FFD166] to-[#FF9F1C] bg-clip-text text-transparent">
                Kings
              </span>
            </h1>
            <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">
              From your first move to advanced endgames, Knightly Academy covers
              every aspect of chess — interactively.
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/learn/${cat.id}`)}
                  className={`group text-left bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] cursor-pointer`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${cat.color}25` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h2 className="text-white font-black text-xl mb-2 group-hover:text-[#FFD166] transition-colors">
                    {cat.label}
                  </h2>
                  <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: cat.color }}
                  >
                    {cat.lessons} →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnPage;
