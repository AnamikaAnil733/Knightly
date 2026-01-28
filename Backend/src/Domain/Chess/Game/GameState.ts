import { Board } from "../Entities/Board";
import { Queen } from "../Pieces/Queen";
import { Rook } from "../Pieces/Rook";
import { Knight } from "../Pieces/Knight";
import { Bishop } from "../Pieces/Bishop";
import { Position } from "../Position";
import { LegalService } from "../Service/LegalMoveService";
import { Move } from "./Move";
import { PromotionType } from "./PromotionType";


export class GameState{
    private _moveHistory:Move[] = [];
    private _currentTurn:"WHITE"|"BLACK" = "WHITE";

    constructor(
        private readonly _board :Board
    ){}

    getTurn():"WHITE"|"BLACK"{
        return this._currentTurn
    }

    getBoard():Board{
        return this._board
    }

    getHistory():Move[]{
        return [...this._moveHistory]
    }

    getLegalMove(from:Position):Position[]{
        const piece = this._board.getPiece(from);
        if(!piece)return []
        if(piece.color !== this._currentTurn)return[]
        return LegalService.getLegalMove(from,this._board)
    }

    private promotePawn(
        color:"WHITE"|"BLACK",
        to:Position,
        promotionType:PromotionType
    ):void{
        switch(promotionType){
            case "QUEEN":
                this._board.setPiece(to,new Queen(color));
                break;
            case "ROOK":
                this._board.setPiece(to,new Rook(color));
                break ;
            case "KNIGHT":
                this._board.setPiece(to,new Knight(color));
                break;
            case "BISHOP":
                this._board.setPiece(to,new Bishop(color));
                break;         
        }
    }

    makeMove(from:Position,to:Position,promotionType?:PromotionType):void{
        
        const piece = this._board.getPiece(from)
        if(!piece){
            throw new Error("No piece at the square")
        }
        if(piece.color !== this._currentTurn){
            throw new Error("Not your Turn")
        }

        const legalMoves = this.getLegalMove(from)

        const isLegal = legalMoves.some(m=>m.equals(to))
        if(!isLegal){
            throw new Error("Illegal move")
        }
      
        this._board.move(from,to)
        let finalPieceType = piece.type;

        if(piece.type === "PAWN" &&
            ((piece.color === "WHITE" && to.row === 0)||
            (piece.color === "BLACK" && to.row === 7))){
                if(!promotionType){
                    throw new Error("Promotion type required");
                }
                this.promotePawn(piece.color,to,promotionType);
                finalPieceType = promotionType;
            }


        this._moveHistory.push(
            new Move(from,to,finalPieceType,piece.color)
        )
        this._currentTurn = this._currentTurn=== "WHITE"?"BLACK":"WHITE"


    }
    
} 