import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface ChessAnimationProps {
  isSignup: boolean;
}

const ROWS = 8;
const COLS = 8;
const TOTAL = ROWS * COLS;

const BOARD_STYLE = {
  display: "grid",
  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
  width: "240px",
  height: "240px",
  transform: "rotateX(24deg) rotateZ(-3deg)",
  transformStyle: "preserve-3d" as const,
  boxShadow:
    "0 0 0 2px rgba(255,209,102,0.4), 0 30px 70px rgba(0,0,0,0.8), 0 0 50px rgba(107,46,255,0.3)",
  borderRadius: "3px",
  overflow: "hidden" as const,
};

const WRAPPER_STYLE = (side: "left" | "right") => ({
  position: "absolute" as const,
  // Left panel center = 25% of 200%-wide container; right = 75%
  left: side === "left" ? "calc(25% - 120px)" : "calc(75% - 120px)",
  top: "15%",
  perspective: "600px",
  perspectiveOrigin: "50% 30%",
});

function renderSquares(
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  offset: number,
) {
  return Array.from({ length: TOTAL }).map((_, i) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const isLight = (row + col) % 2 === 0;
    return (
      <div
        key={i}
        ref={(el) => {
          refs.current[offset + i] = el;
        }}
        style={{
          background: isLight
            ? "rgba(220, 185, 100, 0.75)"
            : "rgba(14, 20, 55, 0.95)",
          border: isLight
            ? "1px solid rgba(255,220,120,0.3)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow: "none",
          transformOrigin: "top center",
          willChange: "transform, opacity",
        }}
      />
    );
  });
}

const ChessAnimation: React.FC<ChessAnimationProps> = ({ isSignup }) => {
  // squares 0–63 = left board, 64–127 = right board
  const allSquaresRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (tlRef.current) tlRef.current.kill();

    const all = allSquaresRef.current.filter(Boolean) as HTMLDivElement[];
    if (all.length < TOTAL * 2) return;

    // Reset both boards
    gsap.set(all, { opacity: 0, scaleY: 0, rotateX: -90 });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tlRef.current = tl;

    // Animate both boards together (same stagger config, same timeline)
    const animateBoard = (squares: HTMLDivElement[], label: string) => {
      tl.to(
        squares,
        {
          opacity: 1,
          scaleY: 1,
          rotateX: 0,
          duration: 0.4,
          stagger: { amount: 1.8, from: "start", grid: [ROWS, COLS] },
          ease: "back.out(1.4)",
        },
        label,
      );

      tl.to(
        squares,
        {
          boxShadow: "inset 0 0 18px rgba(255,209,102,0.6)",
          duration: 0.25,
          stagger: { amount: 1.5, from: "center", grid: [ROWS, COLS] },
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        `${label}+=2.1`,
      );

      tl.to(
        squares,
        {
          boxShadow: "inset 0 0 12px rgba(107,46,255,0.5)",
          duration: 0.2,
          stagger: { amount: 1.2, from: "end", grid: [ROWS, COLS] },
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        `${label}+=3.5`,
      );

      tl.to(
        squares,
        {
          opacity: 0,
          scaleY: 0,
          rotateX: 90,
          duration: 0.35,
          stagger: { amount: 1.4, from: "end", grid: [ROWS, COLS] },
          ease: "power2.in",
        },
        `${label}+=4.2`,
      );
    };

    const leftSquares = all.slice(0, TOTAL);
    const rightSquares = all.slice(TOTAL);

    // Both boards start at the same time
    animateBoard(leftSquares, "start");
    animateBoard(rightSquares, "start");

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [isSignup]);

  return (
    <div
      className="absolute pointer-events-none overflow-visible"
      style={{ inset: 0, zIndex: 5 }}
    >
      {/* LEFT panel board — above "Existing User?" */}
      <div style={WRAPPER_STYLE("left")}>
        <div style={BOARD_STYLE}>{renderSquares(allSquaresRef, 0)}</div>
      </div>

      {/* RIGHT panel board — above "Hello, Friend!" */}
      <div style={WRAPPER_STYLE("right")}>
        <div style={BOARD_STYLE}>{renderSquares(allSquaresRef, TOTAL)}</div>
      </div>

      {/* Bottom fade — cleans up text readability on both panels */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "38%",
          background:
            "linear-gradient(to top, rgba(5,8,22,1) 0%, rgba(5,8,22,0.5) 50%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default ChessAnimation;
