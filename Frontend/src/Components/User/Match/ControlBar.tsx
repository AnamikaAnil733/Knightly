import { FlagIcon, HandshakeIcon } from 'lucide-react'

type ControlBarProps = {
  onResign?: () => void;
  onDraw?: () => void;
  onRematch?: () => void;
}

export function ControlBar({ onResign, onDraw }: ControlBarProps) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 w-full">
      {/* Offer Draw */}
      <button
        onClick={onDraw}
        className="group relative w-full px-4 py-3 rounded-xl bg-[#FFD166]/5 hover:bg-[#FFD166]/10 border border-[#FFD166]/20 hover:border-[#FFD166]/40 transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-3">
          <HandshakeIcon className="w-5 h-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
          <span className="font-medium text-[#FFD166]/90 group-hover:text-[#FFD166] text-sm hidden lg:inline">Offer Draw</span>
          <span className="font-medium text-[#FFD166]/90 group-hover:text-[#FFD166] text-sm lg:hidden">Draw</span>
        </div>
      </button>

      {/* Resign */}
      <button
        onClick={onResign}
        className="group w-full px-4 py-3 rounded-xl bg-[#E74C3C]/5 hover:bg-[#E74C3C]/10 border border-[#E74C3C]/20 hover:border-[#E74C3C]/40 transition-all duration-300"
      >
        <div className="flex items-center justify-center gap-3">
          <FlagIcon className="w-5 h-5 text-[#E74C3C] group-hover:scale-110 transition-transform" />
          <span className="font-medium text-[#E74C3C]/90 group-hover:text-[#E74C3C] text-sm">Resign</span>
        </div>
      </button>

    </div>
  )
}
