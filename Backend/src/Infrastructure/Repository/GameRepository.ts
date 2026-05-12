import { BaseRepository } from "./BaseRepository";
import { ChessGame } from "../../Domain/Entity/ChessGame";
import { ChessGameSchemaType } from "../Database/Schema/ChessGameSchema";
import { MongoChessGameMapper } from "../Mapper/MongoChessGameMapper";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { logger } from "../Logger/Logger";
import { Model } from "mongoose";
import { GameCacheService } from "../Redis/GameCacheService";

export class ChessGameRepository
  extends BaseRepository<ChessGame, ChessGameSchemaType>
  implements IChessGameRepository
{
  constructor(model: Model<ChessGameSchemaType>) {
    super(model, MongoChessGameMapper);
  }

  async findById(id: string): Promise<ChessGame | null> {
    const cached = await GameCacheService.get(id);
    if (cached) {
      return cached;
    }
    const game = await super.findById(id);
    if (!game) return null;
    const status = game.getStatus();
    if (status === "ACTIVE" || status === "CHECK") {
      await GameCacheService.set(game);
    }

    return game;
  }


  async update(entity: ChessGame): Promise<ChessGame | null> {
    const updated = await super.update(entity);
    if (!updated || !updated.id) return updated;

    const status = updated.getStatus();
    if (status === "ACTIVE" || status === "CHECK") {
      await GameCacheService.set(updated);
    } else {
      await GameCacheService.del(updated.id);
    }

    return updated;
  }

  async create(entity: ChessGame): Promise<ChessGame> {
    const created = await super.create(entity);
    if (created.id) {
      await GameCacheService.set(created);
    }
    return created;
  }


  async findRecent(limit: number): Promise<ChessGame[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).limit(limit);
    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }

  async findByUserId(
    userId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<ChessGame[]> {
    logger.info(`Finding games for userId: ${userId} (skip: ${skip}, limit: ${limit})`);
    const docs = await this.model
      .find({
        $or: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    logger.info(`Found ${docs.length} games`);
    return docs.map((doc) => {
      try {
        return this.mapper.toEntityFromDocument(doc);
      } catch (err: any) {
        logger.error(`Error mapping game ${doc._id}:`, err);
        throw new Error(`Corrupted game data for ${doc._id}: ${err.message}`);
      }
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.model.countDocuments({
      $or: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
    });
  }

  async findLivePublicGames(): Promise<ChessGame[]> {
    const docs = await this.model
      .find({
        status: { $in: ["ACTIVE", "CHECK"] },
        isPublic: true,
      })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }

  async findAllLiveGames(): Promise<ChessGame[]> {
    const docs = await this.model
      .find({
        status: { $in: ["ACTIVE", "CHECK"] },
      })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }
}
