export interface LeaderboardEntry {
  rank: number;
  displayname: string;
  avatarKey: string;
  rating: number;
  averageRating: number;
  premium: boolean;
  color?: string;
}
