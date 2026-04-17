export interface Lesson {
  id: string;
  title: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  order: number;
  category: string;
  isPremium: boolean;
}

export interface LessonDetail {
  id: string;
  title: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  content: string;
  order: number;
  fen?: string;
}
