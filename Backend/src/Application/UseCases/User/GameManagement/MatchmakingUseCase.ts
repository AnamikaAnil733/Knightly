import {
  IMatchmakingUseCase,
  QueuePlayer,
  MatchResult,
} from "../../../../Domain/Interface/Usecases/User/GameManagement/IMatchmakingUseCase";

export class MatchmakingUseCase implements IMatchmakingUseCase {
  private queue: QueuePlayer[] = [];

  constructor(
    private readonly createGameUseCase: {
      execute(whiteId?: string, blackId?: string, timeControl?: string, difficulty?: number, isPublic?: boolean): Promise<{ gameId: string }>;
    },
  ) {}

  async findMatch(player: QueuePlayer): Promise<MatchResult> {
    // prevent duplicate userId or socketId in queue
    if (
      this.queue.some(
        (p) => p.socketId === player.socketId || p.userId === player.userId,
      )
    ) {
      return { type: "WAITING" };
    }

    const now = Date.now();

    // Look for an opponent in the queue with the SAME time control AND visibility
    const opponentIndex = this.queue.findIndex((qPlayer) => {
      // Must have the same time control
      if (qPlayer.timeControl !== player.timeControl) return false;

      // Must have the same visibility preference (Public matches with Public, Private with Private)
      if (qPlayer.isPublic !== player.isPublic) return false;

      const timeInQueue = (now - qPlayer.joinedAt) / 1000;
      const myTimeInQueue = (now - player.joinedAt) / 1000;

      const maxWait = Math.max(timeInQueue, myTimeInQueue);
      const allowedDiff = 50 + Math.floor(maxWait / 5) * 50;

      const ratingDiff = Math.abs(qPlayer.rating - player.rating);
      return ratingDiff <= allowedDiff;
    });

    if (opponentIndex === -1) {
      this.queue.push(player);
      return { type: "WAITING" };
    }

    // match found remove opponent from queue
    const opponent = this.queue.splice(opponentIndex, 1)[0];

    // If BOTH players want the game to be public, make it public
    const isGamePublic = player.isPublic && opponent.isPublic;

    const whiteFirst = Math.random() < 0.5;
    const white = whiteFirst ? player : opponent;
    const black = whiteFirst ? opponent : player;

    const { gameId } = await this.createGameUseCase.execute(
      white.userId,
      black.userId,
      player.timeControl, // Pass the time control to game creation
      undefined,
      isGamePublic,
    );

    return {
      type: "MATCH_FOUND",
      gameId,
      white,
      black,
    };
  }

  async processQueue(): Promise<MatchResult[]> {
    const results: MatchResult[] = [];
    const now = Date.now();

    // Iterate through the queue and try to find matches for each player
    // We go backwards to handle splice safely if needed, or just restart the scan
    let i = 0;
    while (i < this.queue.length) {
      const player = this.queue[i];
      
      // Look for an opponent for THIS player among OTHER players further in the queue
      let opponentIndex = -1;
      for (let j = i + 1; j < this.queue.length; j++) {
        const qPlayer = this.queue[j];

        if (qPlayer.timeControl !== player.timeControl) continue;
        if (qPlayer.isPublic !== player.isPublic) continue;

        const timeInQueue = (now - qPlayer.joinedAt) / 1000;
        const myTimeInQueue = (now - player.joinedAt) / 1000;
        const maxWait = Math.max(timeInQueue, myTimeInQueue);
        const allowedDiff = 50 + Math.floor(maxWait / 5) * 50;

        const ratingDiff = Math.abs(qPlayer.rating - player.rating);
        if (ratingDiff <= allowedDiff) {
          opponentIndex = j;
          break;
        }
      }

      if (opponentIndex !== -1) {
        // Match found!
        const opponent = this.queue.splice(opponentIndex, 1)[0];
        const matchedPlayer = this.queue.splice(i, 1)[0];

        const isGamePublic = matchedPlayer.isPublic && opponent.isPublic;
        const whiteFirst = Math.random() < 0.5;
        const white = whiteFirst ? matchedPlayer : opponent;
        const black = whiteFirst ? opponent : matchedPlayer;

        const { gameId } = await this.createGameUseCase.execute(
          white.userId,
          black.userId,
          matchedPlayer.timeControl,
          undefined,
          isGamePublic
        );

        results.push({
          type: "MATCH_FOUND",
          gameId,
          white,
          black,
        });

        // Since we spliced current index, don't increment i
        continue;
      }

      i++;
    }

    return results;
  }

  removeFromQueue(socketId: string) {
    this.queue = this.queue.filter((p) => p.socketId !== socketId);
  }

  getQueueSize() {
    return this.queue.length;
  }

  getQueueSizeFor(timeControl: string) {
    return this.queue.filter((p) => p.timeControl === timeControl).length;
  }
}
