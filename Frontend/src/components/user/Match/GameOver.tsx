import { useEffect } from "react";
import confetti from "canvas-confetti";

type Props = {
  status: "CHECKMATE" | "STALEMATE";
  turn: "WHITE" | "BLACK";
};

export function GameOver({ status, turn }: Props) {
  const winner =
    status === "CHECKMATE"
      ? turn === "WHITE"
        ? "BLACK"
        : "WHITE"
      : null;

  const isWin = status === "CHECKMATE";

  useEffect(() => {
    if (!isWin) return;

    // 🎵 Play victory sound
    const audio = new Audio("/sounds/victory.mp3");
    audio.volume = 0.7;
    audio.play();

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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative px-16 py-10 rounded-3xl bg-[#11193F] 
border border-amber-400
shadow-[0_0_35px_rgba(255,215,0,0.5),0_25px_60px_rgba(0,0,0,0.25)]

text-center animate-bounceIn pointer-events-auto">

        
        {/* 👑 Crown Animation */}
        {isWin && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-float">
            <span className="text-6xl drop-shadow-lg">👑</span>
          </div>
        )}
  
        <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500">
          {isWin ? "Victory!" : "Draw"}
        </h1>
  
        <p className="text-lg text-white mt-2">
          {isWin ? (
            <>
              <span className="font-semibold text-white">
                {winner}
              </span>{" "}
              wins the game!
            </>
          ) : (
            "Well played by both sides!"
          )}
        </p>
  
        {isWin && (
          <div className="font-semibold text-white uppercase tracking-widest mt-2">
            Checkmate
          </div>
        )}
      </div>
    </div>
  );
  
}
