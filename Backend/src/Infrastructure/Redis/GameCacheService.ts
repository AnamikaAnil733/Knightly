import { redisClient } from "./RedisClient";
import { ChessGame } from "../../Domain/Entity/ChessGame";
import { Board } from "../../Domain/Chess/Entities/Board";
import { GameState } from "../../Domain/Chess/Game/GameState";
import { GameClock } from "../../Domain/Entity/GameClock";
import { MongoChessGameMapper } from "../Mapper/MongoChessGameMapper";

const GAME_CACHE_PREFIX = "game:cache:";
const GAME_CACHE_TTL_SECONDS = 1800;

export class GameCacheService {
  private static cacheKey(gameId: string): string {
    return `${GAME_CACHE_PREFIX}${gameId}`;
  }

  static serialize(game: ChessGame): string {
    const data = MongoChessGameMapper.toDocumentFromEntity(game);
    return JSON.stringify({
      ...data,
      id: game.id,
      createdAt: game.getCreatedAt()?.toISOString(),
    });
  }

  static deserialize(raw: string): ChessGame {
    const data = JSON.parse(raw);

    const board = Board.deserialize(data.board);
    const gameState = new GameState(board);
    gameState.restore({
      turn: data.turn,
      history: data.history,
      positionHistory: data.positionHistory,
      halfMoveClock: data.halfMoveClock,
    });

    const clock = new GameClock(
      data.clock.whiteTime,
      data.clock.blackTime,
      data.clock.increment,
      data.clock.turn,
      data.clock.lastMoveTimestamp,
    );

    return new ChessGame(
      gameState,
      data.status,
      clock,
      data.whitePlayerId,
      data.blackPlayerId,
      data.timeControl || "5+0",
      data.id,
      data.isRatingUpdated ?? false,
      data.whiteRatingChange,
      data.blackRatingChange,
      data.difficulty,
      data.isPublic ?? false,
      data.createdAt ? new Date(data.createdAt) : undefined,
    );
  }


  static async set(game: ChessGame): Promise<void> {
    if (!game.id) return;
    const key = this.cacheKey(game.id);
    await redisClient.set(key, this.serialize(game), { EX: GAME_CACHE_TTL_SECONDS });
  }

  static async get(gameId: string): Promise<ChessGame | null> {
    const key = this.cacheKey(gameId);
    const raw = await redisClient.get(key);
    if (!raw) return null;

    try {
      const game = this.deserialize(raw);
      await redisClient.expire(key, GAME_CACHE_TTL_SECONDS);
      return game;
    } catch (err) {
      console.warn(`[GameCacheService] Corrupted cache for ${gameId}, evicting.`, err);
      await redisClient.del(key);
      return null;
    }
  }

  static async del(gameId: string): Promise<void> {
    await redisClient.del(this.cacheKey(gameId));
  }
}
