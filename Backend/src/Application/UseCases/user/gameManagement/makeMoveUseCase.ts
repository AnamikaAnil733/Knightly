import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IMakeMoveUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IMakeMoveUseCase";
import { LegalService } from "../../../../Domain/Chess/Service/LegalMoveService";
import { Position } from "../../../../Domain/Chess/Position";


export class MakeMoveUsecase implements IMakeMoveUseCase{
    constructor(
        private readonly _gameRepo:IChessGameRepository,
    ){}
    async execute(gameId: string, from: { row: never; col: number; }, to: { row: number; col: number; }): Promise<void> {
        const game = await this._gameRepo.findById(gameId)
        if(!game){
            throw new Error("Game is not found")
        }

        const gameState = game.getGameState();
        const board = gameState.getBoard();

        const fromP = new Position(from.row,from.col);
        const toP = new Position(to.row,to.col);

        const piece = board.getPiece(fromP);
        if(!piece){
            throw new Error("No piece is found")
        }

        if(piece.color !== gameState.getTurn()){
            throw new Error("not your turn")
        }

        const LegalMoves = LegalService.getLegalMove(fromP,board);
        const isLegal = LegalMoves.some(
            m=>m.row === toP.row && m.column === toP.column
        )

        if(!isLegal){
            throw new Error("Illegal move")
        }

        gameState.makeMove(fromP,toP)
        await this._gameRepo.update(game)

    }
}