
import { FlagIcon, HandshakeIcon, RefreshCwIcon } from 'lucide-react'
export function ControlBar() {
  return (
    <div className="flex items-center gap-4">
      {/* Offer Draw */}
      <button
        className="px-6 py-3 rounded-lg border-2 border-[#FFD166] text-[#FFD166] font-semibold hover:bg-[#FFD166]/10 transition-all"
        style={{
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 0 20px rgba(255, 209, 102, 0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <HandshakeIcon className="w-5 h-5" />
          <span>Offer Draw</span>
        </div>
      </button>
      {/* Resign */}
      <button
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white font-semibold hover:brightness-110 transition-all"
        style={{
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 0 20px rgba(231, 76, 60, 0.3)',
        }}
      >
        <div className="flex items-center gap-2">
          <FlagIcon className="w-5 h-5" />
          <span>Resign</span>
        </div>
      </button>
      {/* Rematch */}
      <button
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#3A6FF7] to-[#6B2EFF] text-white font-semibold hover:brightness-110 transition-all"
        style={{
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 0 20px rgba(58, 111, 247, 0.4)',
        }}
      >
        <div className="flex items-center gap-2">
          <RefreshCwIcon className="w-5 h-5" />
          <span>Rematch</span>
        </div>
      </button>
    </div>
  )
}
