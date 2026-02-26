/**
 *
 * Returns the recommended puzzle difficulty for today based on the UTC day:
 *
 *   Monday    → Easy
 *   Tuesday   → Medium
 *   Wednesday → Hard
 *   Thursday  → Medium
 *   Friday    → Hard
 *   Saturday  → Expert
 *   Sunday    → Expert
 */

export type DailyDifficulty = "easy" | "medium" | "hard" | "expert";

const DAY_DIFFICULTY_MAP: Record<number, DailyDifficulty> = {
  0: "expert",
  1: "easy",
  2: "medium",
  3: "hard",
  4: "medium",
  5: "hard",
  6: "expert",
};

const DAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/** Get today's recommended difficulty level */
export function getDailyDifficulty(): DailyDifficulty {
  const day = new Date().getUTCDay();
  return DAY_DIFFICULTY_MAP[day] ?? "medium";
}

/** Get today's UTC day name (e.g. "Monday") */
export function getTodayLabel(): string {
  const day = new Date().getUTCDay();
  return DAY_LABELS[day] ?? "Today";
}

/** Check if a given difficulty string matches today's recommended difficulty */
export function isTodaysDifficulty(difficulty: string): boolean {
  return difficulty.toLowerCase() === getDailyDifficulty();
}
