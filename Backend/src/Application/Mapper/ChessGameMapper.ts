import { Board } from "../../Domain/Chess/Entities/Board";
import { ChessGameSchemaType } from "../../Infrastructure/Database/Schema/ChessGameSchema";
import { HydratedDocument } from "mongoose";
import { ChessGame } from "../../Domain/Entity/ChessGame";
import { GameState } from "../../Domain/Chess/Game/GameState";
import { GameClock } from "../../Domain/Entity/GameClock";

export class ChessGameMapper {
  static toEntityFromDocument(
    doc: HydratedDocument<ChessGameSchemaType>,
  ): ChessGame {
    const board = Board.deserialize(doc.board);

    const gameState = new GameState(board);
    gameState.restore({
      turn: doc.turn,
      history: doc.history,
      positionHistory: doc.positionHistory,
      halfMoveClock: doc.halfMoveClock,
    });
    const clock = new GameClock(
      doc.clock.whiteTime,
      doc.clock.blackTime,
      doc.clock.increment,
      doc.clock.turn,
      doc.clock.lastMoveTimestamp,
    );

    return new ChessGame(
      gameState,
      doc.status,
      clock,
      doc.whitePlayerId,
      doc.blackPlayerId,
      doc._id.toString(),
    );
  }

  static toDocumentFromEntity(entity: ChessGame): Partial<ChessGameSchemaType> {
    const gameState = entity.getGameState();
    const board = gameState.getBoard();
    const snapShot = gameState.getSnapshot();

    const clock = entity.getClock();

    return {
      board: board.serialize(),
      turn: snapShot.turn,
      history: snapShot.history,
      positionHistory: snapShot.positionHistory,
      halfMoveClock: snapShot.halfMoveClock,
      status: entity.getStatus(),
      clock: {
        whiteTime: clock.whiteTime,
        blackTime: clock.blackTime,
        increment: clock.increment,
        turn: clock.turn,
        lastMoveTimestamp: clock.lastMoveTimestamp,
      },
      whitePlayerId: entity.getWhitePlayerId(),
      blackPlayerId: entity.getBlackPlayerId(),
    };
  }
}
