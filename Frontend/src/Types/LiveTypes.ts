export interface LiveGame {
  id: string;
  whitePlayerId?: string;
  blackPlayerId?: string;
  timeControl: string;
  status: string;
  whiteRatingChange?: number;
  blackRatingChange?: number;
}
