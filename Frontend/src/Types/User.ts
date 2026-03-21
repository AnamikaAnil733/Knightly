export interface IUser {
  id: string;
  displayname: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  isNewUser: boolean;
  createdAt: string;
  gamesPlayed: number;
  premium: boolean;
  rating: {
    BULLET: number;
    BLITZ: number;
    RAPID: number;
    CLASSICAL: number;
  };
  gamesWin: number;
  longestStreak: number;
  currentStreak: number;
  rewards: string[];
  achievements: string[];

  // Avatar
  avatarUrl?: string | null;
  avatarSeed: string;
  avatarStyle: string;
}

export enum UserRole {
  "ADMIN" = "admin",
  "USER" = "user",
}

export interface UserAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

export interface RootState {
  userAuth: UserAuthState;
}
