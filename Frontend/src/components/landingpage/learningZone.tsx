
import { BookOpenIcon, PuzzleIcon, BotIcon, SparklesIcon } from 'lucide-react'
export function LearningZone() {
  const cards = [
    {
      title: 'Learn Chess',
      icon: BookOpenIcon,
      description: 'Master the fundamentals',
    },
    {
      title: 'Tactics Puzzles',
      icon: PuzzleIcon,
      description: 'Sharpen your skills',
    },
    {
      title: 'AI Practice Mode',
      icon: BotIcon,
      description: 'Train with AI opponents',
    },
    {
      title: "Solve Today's Puzzle",
      icon: SparklesIcon,
      description: 'Daily challenge awaits',
    },
  ]
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#1B1452] to-[#0A0F2C]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Learning & Practice Zone
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#11193F]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFD166]/50 transition-all card-glow text-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <card.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-[#C9CAD9] text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
