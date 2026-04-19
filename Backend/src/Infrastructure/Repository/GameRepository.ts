import { BaseRepository } from "./BaseRepository";
import { ChessGame } from "../../Domain/Entity/ChessGame";
import { ChessGameSchemaType } from "../Database/Schema/ChessGameSchema";
import { MongoChessGameMapper } from "../Mapper/MongoChessGameMapper";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { logger } from "../Logger/Logger";
import { Model } from "mongoose";

export class ChessGameRepository
  extends BaseRepository<ChessGame, ChessGameSchemaType>
  implements IChessGameRepository
{
  constructor(model: Model<ChessGameSchemaType>) {
    super(model, MongoChessGameMapper);
  }

  async findRecent(limit: number): Promise<ChessGame[]> {
    const docs = await this.model.find().sort({ createdAt: -1 }).limit(limit);
    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }

  async findByUserId(userId: string): Promise<ChessGame[]> {
    logger.info(`Finding games for userId: ${userId}`);
    const docs = await this.model
      .find({
        $or: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      })
      .sort({ createdAt: -1 })
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
