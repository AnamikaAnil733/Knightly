import { Board } from "../../Domain/Chess/Entities/Board";
import { ChessGameSchemaType } from "../../Infrastructure/database/Schema/ChessGameSchema";
import { HydratedDocument } from "mongoose";
import { ChessGame } from "../../Domain/Entity/chessGame";
import { GameState } from "../../Domain/Chess/Game/GameState";

export class ChessGameMapper{
  static toEntityFromDocument(
    doc:HydratedDocument<ChessGameSchemaType>,
  ): ChessGame{
    const board = Board.deserialize(doc.board);

    const gameState = new GameState(board);
    gameState.restore({
      turn:doc.turn,
      history:doc.history,
    });

    return new ChessGame(
      gameState,
      doc.status,
      doc._id.toString(),
    );
  }


  static toDocumentFromEntity(entity:ChessGame):Partial<ChessGameSchemaType>{
    const gameState = entity.getGameState();
    const board = gameState.getBoard();
    const snapShot = gameState.getSnapshot();

    return {
      board : board.serialize(),
      turn : snapShot.turn,
      history : snapShot.history,
      status : entity.getStatus(),
    };
  }

}
