import {
  IMatchmakingUseCase,
  QueuePlayer,
  MatchResult,
} from "../../../../Domain/Interface/Usecases/User/GameManagement/IMatchmakingUseCase";
import { redisClient } from "../../../../Infrastructure/Redis/RedisClient";
import { v4 as uuidv4 } from "uuid";

const QUEUE_LIST_KEY = "matchmaking:queue";
const PLAYERS_HASH_KEY = "matchmaking:players";
const USER_IDS_HASH_KEY = "matchmaking:user_ids";
const FORMAT_COUNTS_KEY = "matchmaking:format_counts";
const LOCK_KEY = "matchmaking:lock";
const LOCK_TTL_SECONDS = 5;
const CACHE_TTL_SECONDS = 300; // 5 minutes

const RELEASE_LOCK_LUA = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;

export class MatchmakingUseCase implements IMatchmakingUseCase {
  constructor(
    private readonly createGameUseCase: {
      execute(whiteId?: string, blackId?: string, timeControl?: string, difficulty?: number, isPublic?: boolean): Promise<{ gameId: string }>;
    },
  ) {}

  async findMatch(player: QueuePlayer): Promise<MatchResult> {
    // FIX 1: O(1) duplicate-socket check (unchanged)
    const existingBySocket = await redisClient.hGet(PLAYERS_HASH_KEY, player.socketId);
    if (existingBySocket) {
      return { type: "WAITING" };
    }

    // FIX 1: O(1) duplicate-userId check via dedicated hash
    const existingSocketForUser = await redisClient.hGet(USER_IDS_HASH_KEY, player.userId);
    if (existingSocketForUser) {
      return { type: "WAITING" };
    }

    // Atomically add player to all four structures
    const pipeline = redisClient.multi();
    pipeline.hSet(PLAYERS_HASH_KEY, player.socketId, JSON.stringify(player));
    pipeline.hSet(USER_IDS_HASH_KEY, player.userId, player.socketId);
    pipeline.rPush(QUEUE_LIST_KEY, player.socketId);
    pipeline.hIncrBy(FORMAT_COUNTS_KEY, player.timeControl, 1); // O(1) format counter
    pipeline.expire(PLAYERS_HASH_KEY, CACHE_TTL_SECONDS);
    pipeline.expire(USER_IDS_HASH_KEY, CACHE_TTL_SECONDS);
    pipeline.expire(QUEUE_LIST_KEY, CACHE_TTL_SECONDS);
    pipeline.expire(FORMAT_COUNTS_KEY, CACHE_TTL_SECONDS);
    await pipeline.exec();

    return { type: "WAITING" };
  }

  async processQueue(): Promise<MatchResult[]> {
    // FIX 2: Acquire lock with a unique token so only the owner can release it
    const lockToken = uuidv4();
    const lockAcquired = await redisClient.set(LOCK_KEY, lockToken, {
      NX: true,
      EX: LOCK_TTL_SECONDS,
    });

    if (!lockAcquired) {
      return []; // Another instance is already processing
    }

    const results: MatchResult[] = [];
    try {
      const socketIds = await redisClient.lRange(QUEUE_LIST_KEY, 0, -1);
      if (socketIds.length < 2) return results;

      const allPlayersRaw = await redisClient.hGetAll(PLAYERS_HASH_KEY);
      const players: QueuePlayer[] = socketIds
        .map((id) => {
          const raw = allPlayersRaw[id];
          if (!raw) return null;
          try {
            return JSON.parse(raw) as QueuePlayer;
          } catch {
            return null;
          }
        })
        .filter(Boolean) as QueuePlayer[];

      const now = Date.now();
      const matched = new Set<string>();

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (matched.has(player.socketId)) continue;

        for (let j = i + 1; j < players.length; j++) {
          const candidate = players[j];
          if (matched.has(candidate.socketId)) continue;

          if (candidate.timeControl !== player.timeControl) continue;
          if (candidate.isPublic !== player.isPublic) continue;

          const timeInQueue = (now - candidate.joinedAt) / 1000;
          const myTimeInQueue = (now - player.joinedAt) / 1000;
          const maxWait = Math.max(timeInQueue, myTimeInQueue);
          const allowedDiff = 50 + Math.floor(maxWait / 5) * 50;

          const ratingDiff = Math.abs(candidate.rating - player.rating);
          if (ratingDiff > allowedDiff) continue;

          matched.add(player.socketId);
          matched.add(candidate.socketId);

          const removePipeline = redisClient.multi();
          removePipeline.lRem(QUEUE_LIST_KEY, 0, player.socketId);
          removePipeline.lRem(QUEUE_LIST_KEY, 0, candidate.socketId);
          removePipeline.hDel(PLAYERS_HASH_KEY, player.socketId);
          removePipeline.hDel(PLAYERS_HASH_KEY, candidate.socketId);
          removePipeline.hDel(USER_IDS_HASH_KEY, player.userId);
          removePipeline.hDel(USER_IDS_HASH_KEY, candidate.userId);
          await removePipeline.exec();

          const isGamePublic = player.isPublic && candidate.isPublic;
          const whiteFirst = Math.random() < 0.5;
          const white = whiteFirst ? player : candidate;
          const black = whiteFirst ? candidate : player;

          try {
            const { gameId } = await this.createGameUseCase.execute(
              white.userId,
              black.userId,
              player.timeControl,
              undefined,
              isGamePublic,
            );
            results.push({ type: "MATCH_FOUND", gameId, white, black });

            // Decrement format counter for both matched players (same format, 2 players removed)
            await redisClient.hIncrBy(FORMAT_COUNTS_KEY, player.timeControl, -2);
          } catch (err) {
            console.error(
              `[Matchmaking] Failed to create game for ${white.userId} vs ${black.userId}:`,
              err,
            );
           
          }


          break;
        }
      }
    } finally {
      // FIX 2: Atomic lock release — only deletes if our token still matches
      await redisClient.eval(RELEASE_LOCK_LUA, {
        keys: [LOCK_KEY],
        arguments: [lockToken],
      });
    }

    return results;
  }

  async removeFromQueue(socketId: string): Promise<void> {
    const playerJson = await redisClient.hGet(PLAYERS_HASH_KEY, socketId);
    const pipeline = redisClient.multi();
    pipeline.lRem(QUEUE_LIST_KEY, 0, socketId);
    pipeline.hDel(PLAYERS_HASH_KEY, socketId);
    if (playerJson) {
      try {
        const player: QueuePlayer = JSON.parse(playerJson);
        pipeline.hDel(USER_IDS_HASH_KEY, player.userId);
        pipeline.hIncrBy(FORMAT_COUNTS_KEY, player.timeControl, -1); 
      } catch {
        // JSON was malformed; still safe to proceed
      }
    }
    await pipeline.exec();
  }

  async getQueueSize(): Promise<number> {
    return await redisClient.lLen(QUEUE_LIST_KEY);
  }

  async getQueueSizeFor(timeControl: string): Promise<number> {
    const count = await redisClient.hGet(FORMAT_COUNTS_KEY, timeControl);
    return count ? Math.max(0, parseInt(count, 10)) : 0;
  }
}
