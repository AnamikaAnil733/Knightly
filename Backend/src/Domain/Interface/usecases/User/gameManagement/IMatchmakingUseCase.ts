export type QueuePlayer = {
  userId: string;
  socketId: string;
  rating: number;
  joinedAt: number;
};

export type MatchResult =
  | { type: "WAITING" }
  | {
      type: "MATCH_FOUND";
      gameId: string;
      white: QueuePlayer;
      black: QueuePlayer;
    };

export interface IMatchmakingUseCase {
  findMatch(player: QueuePlayer): Promise<MatchResult>;
  removeFromQueue(socketId: string): void;
  getQueueSize(): number;
}
