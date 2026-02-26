import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, RefreshCw } from "lucide-react";
import Lottie from "lottie-react";

type Props = {
  status: "CHECKMATE" | "STALEMATE" | "WHITE_TIMEOUT" | "BLACK_TIMEOUT";
  turn: "WHITE" | "BLACK";
  myRole: "WHITE" | "BLACK" | "SPECTATOR" | null;
};

type Outcome = "win" | "lose" | "draw" | "spectator";

export function GameOver({ status, turn, myRole }: Props) {
  const winner =
    status === "CHECKMATE"
      ? turn === "WHITE"
        ? "BLACK"
        : "WHITE"
      : status === "WHITE_TIMEOUT"
      ? "BLACK"
      : status === "BLACK_TIMEOUT"
      ? "WHITE"
      : null;

  // Determine outcome from the current player's perspective
  const getOutcome = (): Outcome => {
    if (status === "STALEMATE") return "draw";
    if (!myRole || myRole === "SPECTATOR") return "spectator";
    if (winner === myRole) return "win";
    return "lose";
  };

  const outcome = getOutcome();
  const isWin = outcome === "win";
  const isLose = outcome === "lose";
  const isDraw = outcome === "draw";

  // Load lottie animation data
  const [trophyData, setTrophyData] = useState<object | null>(null);
  const [defeatData, setDefeatData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/lottie/trophy.json")
      .then((res) => res.json())
      .then((data) => setTrophyData(data))
      .catch(() => {});

    fetch("/lottie/defeat.json")
      .then((res) => res.json())
      .then((data) => setDefeatData(data))
      .catch(() => {});
  }, []);

  // ── Win Effects ──
  useEffect(() => {
    if (!isWin) return;

    // 🎵 Play victory sound
    const audio = new Audio("/sounds/victory.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});

    // 🎆 1️⃣ Big Central Explosion
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });

    // 🎇 2️⃣ Side Cannons
    setTimeout(() => {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });

        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });

        requestAnimationFrame(frame);
      };

      frame();
    }, 300);

    // 🌧 3️⃣ Slow Confetti Rain
    setTimeout(() => {
      const rainDuration = 4000;
      const rainEnd = Date.now() + rainDuration;

      const rain = () => {
        if (Date.now() > rainEnd) return;

        confetti({
          particleCount: 2,
          spread: 60,
          origin: {
            x: Math.random(),
            y: 0,
          },
          gravity: 0.6,
          scalar: 0.8,
        });

        requestAnimationFrame(rain);
      };

      rain();
    }, 800);
  }, [isWin]);

  // ── Lose Effects ──
  useEffect(() => {
    if (!isLose) return;

    // 🔊 Play defeat sound
    const audio = new Audio("/sounds/defeat.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, [isLose]);

  // ── Theme config based on outcome ──
  const theme = {
    win: {
      title: "Victory!",
      subtitle: "You won the Chess Championship",
      titleColor: "#ffffff",
      titleGlow: "0 0 40px rgba(139, 92, 246, 0.5), 0 2px 4px rgba(0,0,0,0.3)",
      cardBg: "linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #121225 100%)",
      cardGlow: "rgba(139, 92, 246, 0.3)",
      cardBorder: "rgba(139, 92, 246, 0.25)",
      innerGlow: "rgba(139, 92, 246, 0.08)",
      eloBadgeBg: "rgba(34, 197, 94, 0.1)",
      eloBadgeBorder: "rgba(34, 197, 94, 0.3)",
      eloColor: "text-green-400",
      eloText: "+24 ELO",
      eloIcon: <TrendingUp className="w-4 h-4 text-green-400" />,
      buttonGradient:
        "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      buttonGlow:
        "0 4px 20px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    lose: {
      title: "Defeat",
      subtitle: "Better luck next time, knight",
      titleColor: "#f87171",
      titleGlow: "0 0 40px rgba(239, 68, 68, 0.4), 0 2px 4px rgba(0,0,0,0.3)",
      cardBg: "linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #121225 100%)",
      cardGlow: "rgba()",
      cardBorder: "rgba()",
      innerGlow: "rgba(239, 68, 68, 0.06)",
      eloBadgeBg: "rgba(239, 68, 68, 0.1)",
      eloBadgeBorder: "rgba(239, 68, 68, 0.3)",
      eloColor: "text-red-400",
      eloText: "-24 ELO",
      eloIcon: <TrendingDown className="w-4 h-4 text-red-400" />,
      buttonGradient:
        "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      buttonGlow:
        "0 4px 20px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    draw: {
      title: "Draw",
      subtitle: "Well played by both sides!",
      titleColor: "#a0a0c0",
      titleGlow: "0 2px 4px rgba(0,0,0,0.3)",
      cardBg: "linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #121225 100%)",
      cardGlow: "rgba(234, 179, 8, 0.2)",
      cardBorder: "rgba(234, 179, 8, 0.2)",
      innerGlow: "rgba(234, 179, 8, 0.05)",
      eloBadgeBg: "rgba(234, 179, 8, 0.1)",
      eloBadgeBorder: "rgba(234, 179, 8, 0.3)",
      eloColor: "text-yellow-400",
      eloText: "+0 ELO",
      eloIcon: null,
      buttonGradient:
        "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      buttonGlow:
        "0 4px 20px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
    spectator: {
      title: winner ? `${winner} WINS` : "Draw",
      subtitle: winner ? "Checkmate!" : "Well played by both sides!",
      titleColor: "#ffffff",
      titleGlow: "0 0 40px rgba(139, 92, 246, 0.5), 0 2px 4px rgba(0,0,0,0.3)",
      cardBg: "linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #121225 100%)",
      cardGlow: "rgba(139, 92, 246, 0.3)",
      cardBorder: "rgba(139, 92, 246, 0.25)",
      innerGlow: "rgba(139, 92, 246, 0.08)",
      eloBadgeBg: "rgba(139, 92, 246, 0.1)",
      eloBadgeBorder: "rgba(139, 92, 246, 0.3)",
      eloColor: "text-purple-400",
      eloText: "Game Over",
      eloIcon: null,
      buttonGradient:
        "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
      buttonGlow:
        "0 4px 20px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
    },
  };

  const t = theme[outcome];

  const winnerName = winner === "WHITE" ? "White" : "Black";
  const loserName = winner === "WHITE" ? "Black" : "White";
  const winnerScore = status === "CHECKMATE" ? 1 : 0;
  const loserScore = status === "CHECKMATE" ? 0 : 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.1 }}
        className="relative w-[380px] max-w-[90vw] rounded-2xl overflow-hidden pointer-events-auto"
        style={{
          background: t.cardBg,
          boxShadow: `
            0 0 60px ${t.cardGlow},
            0 0 120px ${t.cardGlow
              .replace("0.3", "0.15")
              .replace("0.25", "0.12")
              .replace("0.2", "0.1")},
            0 25px 50px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          border: `1px solid ${t.cardBorder}`,
        }}
      >
        {/* Inner Content */}
        <div className="flex flex-col items-center px-8 pt-10 pb-8">
          {/* Title */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-extrabold tracking-tight mb-2"
            style={{
              fontFamily: "Cinzel, serif",
              color: t.titleColor,
              textShadow: t.titleGlow,
            }}
          >
            {t.title}
          </motion.h1>

          {/* Lottie Animation — Trophy for Win, Defeat X for Lose, Handshake for Draw */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.35,
            }}
            className="relative flex items-center justify-center"
            style={{ width: 120, height: 120 }}
          >
            {/* WIN: Trophy animation */}
            {isWin && trophyData ? (
              <Lottie
                animationData={trophyData}
                loop
                autoplay
                style={{ width: 120, height: 120 }}
              />
            ) : isWin ? (
              /* Fallback while loading */
              <div
                className="text-6xl"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(255, 193, 7, 0.4))",
                }}
              >
                🏆
              </div>
            ) : null}

            {/* LOSE: Defeat animation */}
            {isLose && defeatData ? (
              <Lottie
                animationData={defeatData}
                loop={false}
                autoplay
                style={{ width: 120, height: 120 }}
              />
            ) : isLose ? (
              /* Fallback — swords emoji */
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-6xl"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(239, 68, 68, 0.4))",
                }}
              >
                ⚔️
              </motion.div>
            ) : null}

            {/* DRAW: Handshake pulse */}
            {isDraw && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3))",
                }}
              >
                🤝
              </motion.div>
            )}

            {/* SPECTATOR: Chess King */}
            {outcome === "spectator" && (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-6xl"
                style={{
                  filter: "drop-shadow(0 4px 12px rgba(139, 92, 246, 0.3))",
                }}
              >
                ♚
              </motion.div>
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center text-[#9ca3af] text-sm leading-relaxed mb-5"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t.subtitle}
          </motion.p>

          {/* ELO Badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: t.eloBadgeBg,
              border: `1px solid ${t.eloBadgeBorder}`,
            }}
          >
            {t.eloIcon}
            <span
              className={`${t.eloColor} font-semibold text-sm`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {t.eloText}
            </span>
          </motion.div>

          {/* Score Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="w-full rounded-xl px-4 py-3 flex items-center justify-between mb-6"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            {/* Left Player — Winner */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: winner
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255, 255, 255, 0.08)",
                  border: winner
                    ? "2px solid rgba(139, 92, 246, 0.5)"
                    : "2px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                👤
              </div>
              <span
                className="text-white text-sm font-medium"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {winner ? winnerName : "Player 1"}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
              <span
                className="text-white text-lg font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {isDraw ? "½" : winnerScore}
              </span>
              <span className="text-[#4a4a6a] text-sm font-medium">—</span>
              <span
                className="text-white text-lg font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {isDraw ? "½" : loserScore}
              </span>
            </div>

            {/* Right Player — Loser */}
            <div className="flex items-center gap-2.5">
              <span
                className="text-[#9ca3af] text-sm font-medium"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {winner ? loserName : "Player 2"}
              </span>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                👤
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="w-full flex flex-col gap-3"
          >
            {/* Rematch Button */}
            <button
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-white font-semibold text-base transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: t.buttonGradient,
                boxShadow: t.buttonGlow,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <Users className="w-5 h-5" />
              Rematch
            </button>

            {/* New Game Button */}
            <button
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-[#a0a0c0] font-semibold text-base transition-all duration-200 hover:text-white hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <RefreshCw className="w-5 h-5" />
              New Game
            </button>
          </motion.div>
        </div>

        {/* Animated Glow Ring — subtle border glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px ${t.innerGlow}`,
          }}
        />
      </motion.div>
    </div>
  );
}
