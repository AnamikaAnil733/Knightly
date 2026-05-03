import { BookOpenIcon, PuzzleIcon, SparklesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LearningZone() {
  const navigate = useNavigate();
  const cards = [
    {
      title: "Learn Chess",
      icon: BookOpenIcon,
      description: "Master the fundamentals",
    },
    {
      title: "Tactics Puzzles",
      icon: PuzzleIcon,
      description: "Sharpen your skills",
    },
    {
      title: "Solve Today's Puzzle",
      icon: SparklesIcon,
      description: "Daily challenge awaits",
    },
  ];
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1437] via-[#1A1F4F] to-[#2A1E6A]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Learning & Practice Zone
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => {
                if (card.title === "Tactics Puzzles") {
                  navigate("/puzzles");
                } else if (card.title === "Solve Today's Puzzle") {
                  navigate("/puzzle/solve/daily");
                } else if (card.title === "Learn Chess") {
                  navigate("/learn");
                }
              }}
              className="bg-[#1C254E]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#4F7CFF]/50 transition-all card-glow text-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#6D5DF6] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <card.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-[#AAB3D1] text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
