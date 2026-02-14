import { BaseRepository } from "./BaseRepository";
import { ChessGame } from "../../Domain/Entity/chessGame";
import { ChessGameSchemaType } from "../database/Schema/ChessGameSchema";
import { ChessGameMapper } from "../../Application/mapper/ChessGameMapper";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { Model } from "mongoose";



export class ChessGameRepository
  extends BaseRepository<ChessGame,ChessGameSchemaType>
  implements IChessGameRepository{
  constructor(model:Model<ChessGameSchemaType>){
    super(model,ChessGameMapper);
  }

}
