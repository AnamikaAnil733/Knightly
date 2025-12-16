
import { CrownIcon } from 'lucide-react'
export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F2C]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrownIcon className="w-8 h-8 text-[#FFD166]" />
          <span
            className="text-2xl font-bold text-[#FFD166]"
            style={{
              fontFamily: 'Cinzel, serif',
            }}
          >
            Knightly
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Play
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Tournaments
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            Leaderboard
          </a>
          <a
            href="#"
            className="text-white hover:text-[#FFD166] transition-colors"
          >
            About
          </a>
        </div>
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold glow-button">
          Login / Signup
        </button>
      </div>
    </nav>
  )
}
