
import { NewspaperIcon, MessageSquareIcon } from 'lucide-react'
export function CommunityNews() {
  const news = [
    {
      title: 'New Tournament System Launched',
      date: 'March 10, 2025',
      excerpt:
        'Experience our revamped tournament platform with enhanced features and rewards.',
    },
    {
      title: 'Top 10 Chess Strategies',
      date: 'March 8, 2025',
      excerpt:
        'Learn from grandmasters about the most effective chess strategies for beginners.',
    },
    {
      title: 'Community Milestone: 1M Players',
      date: 'March 5, 2025',
      excerpt:
        'Celebrating our incredible community reaching one million registered players!',
    },
  ]
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Community & News
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-[#11193F]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#6B2EFF]/50 transition-all card-glow cursor-pointer group"
            >
              <div className="h-48 bg-gradient-to-br from-[#3A6FF7] to-[#6B2EFF] flex items-center justify-center">
                <NewspaperIcon className="w-16 h-16 text-white opacity-50" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquareIcon className="w-4 h-4 text-[#FFD166]" />
                  <span className="text-[#C9CAD9] text-sm">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FFD166] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#C9CAD9]">{item.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
