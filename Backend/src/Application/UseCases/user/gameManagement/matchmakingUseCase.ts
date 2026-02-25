import { IMatchmakingUseCase,QueuePlayer,MatchResult} from "../../../../Domain/Interface/usecases/user/gameManagement/IMatchmakingUseCase";


export class MatchmakingUseCase implements IMatchmakingUseCase{
  private queue: QueuePlayer[] = [];

  constructor(
      private readonly createGameUseCase: {
        execute(whiteId?: string, blackId?: string): Promise<{ gameId: string }>;
      },
  ) {}

  async findMatch(player: QueuePlayer): Promise<MatchResult> {
    // prevent duplicate userId or socketId in queue
    if (this.queue.some(p => p.socketId === player.socketId || p.userId === player.userId)) {
      return { type: "WAITING" };
    }

    const now = Date.now();

    // Look for an opponent in the queue
    const opponentIndex = this.queue.findIndex(qPlayer => {
      const timeInQueue = (now - qPlayer.joinedAt) / 1000;
      const myTimeInQueue = (now - player.joinedAt) / 1000;

     
      const maxWait = Math.max(timeInQueue, myTimeInQueue);
      const allowedDiff = 100 + Math.floor(maxWait / 5) * 50;

      const ratingDiff = Math.abs(qPlayer.rating - player.rating);
      return ratingDiff <= allowedDiff;
    });

    if (opponentIndex === -1) {
      this.queue.push(player);
      return { type: "WAITING" };
    }

    // match found remove opponent from queue
    const opponent = this.queue.splice(opponentIndex, 1)[0];

    const whiteFirst = Math.random() < 0.5;
    const white = whiteFirst ? player : opponent;
    const black = whiteFirst ? opponent : player;

    const { gameId } = await this.createGameUseCase.execute(white.userId, black.userId);

    return {
      type: "MATCH_FOUND",
      gameId,
      white,
      black,
    };
  }

  removeFromQueue(socketId: string) {
    this.queue = this.queue.filter(p => p.socketId !== socketId);
  }

  getQueueSize() {
    return this.queue.length;
  }
}
