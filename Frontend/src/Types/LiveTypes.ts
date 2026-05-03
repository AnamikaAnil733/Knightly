export interface LiveGame {
  id: string;
  whitePlayerId?: string;
  blackPlayerId?: string;
  timeControl: string;
  status: string;
  whiteRatingChange?: number;
  blackRatingChange?: number;
}

export type LiveGames = {
  id: string;
  status: string;
  timeControl: string;
  whitePlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  blackPlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  createdAt: string;
};

export interface Match {
  id: string;
  status: string;
  timeControl: string;
  whitePlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  blackPlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  createdAt: string;
}
