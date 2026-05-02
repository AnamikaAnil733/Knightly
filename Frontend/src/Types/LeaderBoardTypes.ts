export interface LeaderboardEntry {
  rank: number;
  displayname: string;
  avatarKey: string;
  rating: number;
  averageRating: number;
  win: number;
  color?: string;
  streak: number;
}
