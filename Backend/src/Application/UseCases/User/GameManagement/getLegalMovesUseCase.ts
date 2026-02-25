import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { Position } from "../../../../Domain/Chess/Position";
import { IGetLegalMovesUseCase } from "../../../../Domain/Interface/usecases/User/gameManagement/IGetLegalMovesUseCase";
import { LegalService } from "../../../../Domain/Chess/Service/LegalMoveService";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";




export class GetLegalMovesUseCase implements IGetLegalMovesUseCase{
  constructor(
        private readonly _gameRepo:IChessGameRepository,
  ){}

  async execute(gameId: string, p: { row: number; col: number; }): Promise<{ row: number; col: number;type:"NORMAL"|"EN_PASSANT"}[]> {
    const game = await this._gameRepo.findById(gameId);
    if(!game){
      throw new Error(MESSAGES.GAME_NOT_FOUND);
    }

    const gameState = game.getGameState();
    const board = gameState.getBoard();

    const from = new Position(p.row,p.col);
    const piece = board.getPiece(from);

    if(!piece) return [];

    if(piece.color !== gameState.getTurn()){
      return [];
    }

    const legalMoves = LegalService.getLegalMove(from,board);

    const epTarget = board.getEnPassantTarget();

    return legalMoves.map(m=>{
      const isEnPassant =
            epTarget &&
            m.row === epTarget.row &&
            m.column === epTarget.column;
      return{
        row :m.row,
        col :m.column,
        type:isEnPassant ?"EN_PASSANT":"NORMAL",
      };
    });

  }
}
