import{ useState } from 'react'
import { SendIcon } from 'lucide-react'
const messages = [
  {
    sender: 'GrandMaster_Alex',
    text: 'Good game so far!',
    time: '5:30',
  },
  {
    sender: 'You',
    text: 'Thanks! You too',
    time: '5:28',
  },
  {
    sender: 'GrandMaster_Alex',
    text: 'Interesting opening choice',
    time: '5:25',
  },
]
export function ChatPanel() {
  const [message, setMessage] = useState('')
  return (
    <div
      className="w-64 rounded-xl backdrop-blur-md bg-[#11193F]/70 border border-[#6B2EFF]/30 p-6 h-[700px] flex flex-col"
      style={{
        boxShadow: '0 4px 20px rgba(107, 46, 255, 0.2)',
      }}
    >
      <h3
        className="text-white font-semibold text-lg mb-4 pb-3 border-b border-[#6B2EFF]/20"
        style={{
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Chat
      </h3>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${msg.sender === 'You' ? 'text-[#3A6FF7]' : 'text-[#FFD166]'}`}
              >
                {msg.sender}
              </span>
              <span className="text-xs text-[#C9CAD9]/50">{msg.time}</span>
            </div>
            <p
              className="text-sm text-[#C9CAD9] bg-[#1C2445]/30 px-3 py-2 rounded-lg"
              style={{
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-3 pr-12 rounded-lg bg-[#1C2445]/50 border border-[#6B2EFF]/30 text-white text-sm placeholder-[#C9CAD9]/50 focus:outline-none focus:border-[#6B2EFF] focus:ring-1 focus:ring-[#6B2EFF] transition-all"
          style={{
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#6B2EFF]/20 hover:bg-[#6B2EFF]/40 transition-colors">
          <SendIcon className="w-4 h-4 text-[#6B2EFF]" />
        </button>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(28, 36, 69, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 46, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 46, 255, 0.5);
        }
      `}</style>
    </div>
  )
}
