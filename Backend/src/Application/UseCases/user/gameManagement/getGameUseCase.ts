import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { GameOutputDTO } from "../../../../Domain/DTOs/userDTOs";
import { IGetGameUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IGetGameUseCase";

export class GetGameUseCase implements IGetGameUseCase{
    constructor(
        private readonly _chessGameRepository:IChessGameRepository
    ){}

    async execute(gameId: string): Promise<GameOutputDTO> {

        const game = await this._chessGameRepository.findById(gameId);

        if(!game){
            throw new Error("game is not found")
        }

        const gameState = game.getGameState()
        const board = gameState.getBoard()
        return{
            gameId:game.id!,
            turn:gameState.getTurn(),
            board:board.serialize(),
            history: gameState.getHistory().map(move => ({
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
              })),
              
            status:game.getStatus(),

        }

    }
}