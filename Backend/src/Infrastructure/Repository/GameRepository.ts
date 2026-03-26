import { BaseRepository } from "./BaseRepository";
import { ChessGame } from "../../Domain/Entity/ChessGame";
import { ChessGameSchemaType } from "../Database/Schema/ChessGameSchema";
import { MongoChessGameMapper } from "../Mapper/MongoChessGameMapper";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
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
    const docs = await this.model
      .find({
        $or: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      })
      .sort({ createdAt: -1 });
    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }
}
