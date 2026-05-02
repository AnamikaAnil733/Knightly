export interface GameHistoryEntry {
  id: string;
  whitePlayer: {
    id: string;
    displayname: string;
    avatarUrl: string | null;
  };
  blackPlayer: {
    id: string;
    displayname: string;
    avatarUrl: string | null;
  };
  status: string;
  createdAt: string;
  timeControl: string;
  whiteRatingChange?: number;
  blackRatingChange?: number;
}

export interface Match {
  id?: string;
  timeControl: string;
  whitePlayerId?: string;
  blackPlayerId?: string;
}
