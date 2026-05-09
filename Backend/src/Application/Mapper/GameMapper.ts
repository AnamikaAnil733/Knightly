import { ChessGame } from "../../Domain/Entity/ChessGame";
import Auth from "../../Domain/Entity/Auth";
import { GameOutputDTO, GameHistoryDTO, MoveDTO } from "../../Domain/DTOs/UserDTOs";

export class GameMapper {
  static toGameOutputDTO(
    game: ChessGame,
    whitePlayer: { id: string; name: string; rating: number; avatar: string | null } | undefined,
    blackPlayer: { id: string; name: string; rating: number; avatar: string | null } | undefined,
    modeName: string,
  ): GameOutputDTO {
    const gameState = game.getGameState();
    const board = gameState.getBoard();
    const clock = game.getClock();
    const liveTimes = clock.getLiveTimes();

    return {
      gameId: game.id!,
      turn: gameState.getTurn(),
      board: board.serialize(),
      history: gameState.getHistory().map((move) => ({
        from: {
          row: move.from.row,
          col: move.from.column,
        },
        to: {
          row: move.to.row,
          col: move.to.column,
        },
        piece: move.pieceType,
        color: move.color,
        promotion: move.promotionType,
      })),
      status: game.getStatus(),
      clock: {
        whiteTime: liveTimes.whiteTime,
        blackTime: liveTimes.blackTime,
        increment: clock.increment,
        turn: clock.turn,
      },
      whitePlayer,
      blackPlayer,
      timeControl: game.getTimeControl(),
      modeName,
    };
  }

  static toGameHistoryDTO(
    game: ChessGame,
    whitePlayer: { id: string; displayname: string; avatarUrl: string | null },
    blackPlayer: { id: string; displayname: string; avatarUrl: string | null },
  ): GameHistoryDTO {
    return {
      id: game.id!,
      whitePlayer,
      blackPlayer,
      status: game.getStatus(),
      createdAt: game.getCreatedAt()?.toISOString() || new Date().toISOString(),
      timeControl: game.getTimeControl(),
      whiteRatingChange: game.getWhiteRatingChange(),
      blackRatingChange: game.getBlackRatingChange(),
    };
  }
}
