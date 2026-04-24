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
