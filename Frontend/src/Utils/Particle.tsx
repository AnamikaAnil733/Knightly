import React from "react";
import { motion } from "framer-motion";

type Particle = {
  left: number;
  top: number;
  delay: number;
  duration: number;
};

interface KnightlyParticlesProps {
  count?: number;
}

export const KnightlyParticles: React.FC<KnightlyParticlesProps> = ({
  count = 20,
}) => {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    setParticles(
      [...Array(count)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: 6,
        duration: 8,
      })),
    );
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, -15, 10, -10, 0],
            x: [0, 10, -5, 8, 0],
            opacity: [0.4, 1, 0.6, 1, 0.4],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
