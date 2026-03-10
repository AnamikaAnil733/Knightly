export type TimeMode = "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL";

export interface TimeControl {
  name: string; // e.g. "3+2"
  whiteTime: number; // in ms
  blackTime: number; // in ms
  increment: number; // in ms
  mode: TimeMode;
}

export const TIME_CONTROLS: Record<string, TimeControl> = {
  // Bullet (1 to 2 min)
  "1+0": { name: "1+0", whiteTime: 1 * 60 * 1000, blackTime: 1 * 60 * 1000, increment: 0, mode: "BULLET" },
  "2+1": { name: "2+1", whiteTime: 2 * 60 * 1000, blackTime: 2 * 60 * 1000, increment: 1000, mode: "BULLET" },

  // Blitz (3 to 5 min)
  "3+0": { name: "3+0", whiteTime: 3 * 60 * 1000, blackTime: 3 * 60 * 1000, increment: 0, mode: "BLITZ" },
  "3+2": { name: "3+2", whiteTime: 3 * 60 * 1000, blackTime: 3 * 60 * 1000, increment: 2000, mode: "BLITZ" },
  "5+0": { name: "5+0", whiteTime: 5 * 60 * 1000, blackTime: 5 * 60 * 1000, increment: 0, mode: "BLITZ" },
  "5+3": { name: "5+3", whiteTime: 5 * 60 * 1000, blackTime: 5 * 60 * 1000, increment: 3000, mode: "BLITZ" },

  // Rapid (10 to 30 min)
  "10+0": { name: "10+0", whiteTime: 10 * 60 * 1000, blackTime: 10 * 60 * 1000, increment: 0, mode: "RAPID" },
  "15+10": { name: "15+10", whiteTime: 15 * 60 * 1000, blackTime: 15 * 60 * 1000, increment: 10000, mode: "RAPID" },
  "20+0": { name: "20+0", whiteTime: 20 * 60 * 1000, blackTime: 20 * 60 * 1000, increment: 0, mode: "RAPID" },
  "30+0": { name: "30+0", whiteTime: 30 * 60 * 1000, blackTime: 30 * 60 * 1000, increment: 0, mode: "RAPID" },

  // Classical (30 to 60+ min)
  "30+10": { name: "30+10", whiteTime: 30 * 60 * 1000, blackTime: 30 * 60 * 1000, increment: 10000, mode: "CLASSICAL" },
  "45+0": { name: "45+0", whiteTime: 45 * 60 * 1000, blackTime: 45 * 60 * 1000, increment: 0, mode: "CLASSICAL" },
  "60+0": { name: "60+0", whiteTime: 60 * 60 * 1000, blackTime: 60 * 60 * 1000, increment: 0, mode: "CLASSICAL" },
  "45+15": { name: "45+15", whiteTime: 45 * 60 * 1000, blackTime: 45 * 60 * 1000, increment: 15000, mode: "CLASSICAL" },
  "NO_TIMER": { name: "NO_TIMER", whiteTime: 24 * 60 * 60 * 1000, blackTime: 24 * 60 * 60 * 1000, increment: 0, mode: "CLASSICAL" },
};
