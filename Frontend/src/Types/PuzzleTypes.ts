export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  ratingRange: string;
  accent: string;
  tasks: string;
}

export interface UserPuzzleResponseDTO {
  id: string;
  fen: string;
  difficulty: string;
  description?: string;
  solution?: string[];
}

export interface CalendarDay {
  date: Date;
  isSolved: boolean;
  isCurrentMonth: boolean;
}

export interface StreakCalendarProps {
  history: string[];
  weeksToShow?: number;
  compact?: boolean;
  showCurrentMonthOnly?: boolean;
  hideHeader?: boolean;
}

export interface Puzzle {
  id: string;
  fen: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  moves: string[];
  solutionLength: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}
