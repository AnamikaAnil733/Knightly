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
}
