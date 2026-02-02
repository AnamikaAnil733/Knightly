import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { Position } from "../../../../Domain/Chess/Position";
import { IGetLegalMovesUseCase } from "../../../../Domain/Interface/usecases/user/gameManagement/IGetLegalMovesUseCase";
import { LegalService } from "../../../../Domain/Chess/Service/LegalMoveService";



export class GetLegalMovesUseCase implements IGetLegalMovesUseCase{ 
    constructor(
        private readonly _gameRepo:IChessGameRepository,
    ){}

    async execute(gameId: string, p: { row: number; col: number; }): Promise<{ row: number; col: number }[]> {
        const game = await this._gameRepo.findById(gameId);
        if(!game){
            throw new Error("Game is not found")
        }

        const gameState = game.getGameState();
        const board = gameState.getBoard()

        const from = new Position(p.row,p.col);
        const piece = board.getPiece(from)

        if(!piece) return []

        if(piece.color !== gameState.getTurn()){
            return []
        }

        const legalMoves = LegalService.getLegalMove(from,board);

        return legalMoves.map(m=>({
            row :m.row,
            col :m.column
        }))

    }
}