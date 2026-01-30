import { Board } from "../../Domain/Chess/Entities/Board";
import { ChessGameSchema } from "../../Infrastructure/database/Schema/ChessGameSchema";
import { HydratedDocument } from "mongoose";
import { ChessGame } from "../../Domain/Entity/chessGame"
import { GameState } from "../../Domain/Chess/Game/GameState";

export class ChessGameMapper{
    static toEntityFromDocument(
        doc:HydratedDocument<ChessGameSchema>
    ): ChessGame{
        const board = Board.deserialize(doc.board)

        const gameState = new GameState(board);
        gameState.restore({
            turn:doc.turn,
            history:doc.history
        })

        return new ChessGame(
            doc._id.toString(),
            gameState,
            doc.status
        )
    }


    static toDocumentFromEntity(entity:ChessGame):Partial<ChessGameSchema>{
        const gameState = entity.getGameState()
        const board = gameState.getBoard()
        const snapShot = gameState.getSnapshot()

        return {
            board : board.serialize(),
            turn : snapShot.turn,
            history : snapShot.history,
            status : entity.getStatus()
        }
    }

}