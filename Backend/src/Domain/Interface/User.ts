import { UserRole } from "../Types/UserRole";

export interface User {
  displayName: string;
  email: string;
  password?: string;
  googleId?: string;
  isBlocked: boolean;
  gamesPlayed: number;
  gamesWin: number;
  rating: number;
  premium: boolean;
  longestStreak: number;
  currentStreak: number;
  rewards?: string[];
  achievements?: string[];
  subscriptionStart?: Date;
  createdAt?: Date;
  role: UserRole;
}
