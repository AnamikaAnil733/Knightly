import { useState, useEffect, useRef } from "react";
import { SendIcon } from "lucide-react";
import { socket } from "../../../Service/Socket";
import { Message } from "../../../Types/ChatTypes";

interface ChatPanelProps {
  gameId: string;
  senderName: string;
  messages: Message[];
  readOnly?: boolean;
}

export function ChatPanel({
  gameId,
  senderName,
  messages,
  readOnly = false,
}: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      gameId,
      sender: senderName,
      text: message,
    });

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className="w-full h-full rounded-xl backdrop-blur-md bg-[#11193F]/70 border border-[#6B2EFF]/30 p-6 flex flex-col overflow-hidden"
      style={{
        boxShadow: "0 4px 20px rgba(107, 46, 255, 0.2)",
      }}
    >
      <h3
        className="text-white font-semibold text-lg mb-4 pb-3 border-b border-[#6B2EFF]/20 shrink-0"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Live Chat
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#C9CAD9]/30 text-xs italic">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.socketId === socket.id || msg.sender === senderName;
            return (
              <div
                key={index}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
              >
                <div className="flex items-baseline gap-2">
                  {!isMe && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD166]/70">
                      {msg.sender}
                    </span>
                  )}
                  <span className="text-[9px] text-[#C9CAD9]/40">
                    {msg.time}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] text-sm px-3 py-2 rounded-2xl ${
                    isMe
                      ? "bg-gradient-to-br from-[#6B2EFF] to-[#3A6FF7] text-white rounded-tr-none shadow-lg shadow-[#3A6FF7]/10"
                      : "bg-[#1C2445]/50 text-[#C9CAD9] border border-white/5 rounded-tl-none"
                  }`}
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!readOnly && (
        <div className="relative shrink-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a message..."
            className="w-full px-4 py-3 pr-12 rounded-xl bg-[#0A0F2C]/60 border border-[#6B2EFF]/30 text-white text-sm placeholder-[#C9CAD9]/30 focus:outline-none focus:border-[#3A6FF7] focus:ring-1 focus:ring-[#3A6FF7] transition-all"
          />
          <button
            onClick={handleSendMessage}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              message.trim()
                ? "bg-[#3A6FF7] hover:bg-[#6B2EFF] text-white"
                : "bg-[#1C2445]/50 text-[#C9CAD9]/30"
            }`}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 46, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 46, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
