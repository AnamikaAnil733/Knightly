import { Board } from "../Entities/Board";
import { Queen } from "../Pieces/Queen";
import { Rook } from "../Pieces/Rook";
import { Knight } from "../Pieces/Knight";
import { Bishop } from "../Pieces/Bishop";
import { Position } from "../Position";
import { LegalService } from "../Service/LegalMoveService";
import { CheckService } from "../Service/CheckService";
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

    private performCastling(
        from:Position,
        to:Position
    ):void{
        const row = from.row;
        const isKingSide = to.column === 6

        const rookfromCol = isKingSide?7:0
        const rooktoCol = isKingSide?5:3

        this._board.move(from,to);
        const king = this._board.getPiece(to)
        if(king) king.hasMoved = true


        this._board.move(new Position(row,rookfromCol),new Position(row,rooktoCol))
        const rook = this._board.getPiece(new Position(row,rooktoCol))
        if(rook) rook.hasMoved = true
    }

    canCastle(from:Position,to:Position):boolean{
        const king = this._board.getPiece(from);
        if(!king || king.type !== "KING") return false;
        if(king.hasMoved) return false

        const row = from.row;
        const isKingSide = to.column === 6;
        const rookCol = isKingSide?7:0

        const rookP = new Position(row,rookCol);
        const rook = this._board.getPiece(rookP);

        if(!rook|| rook.type !== "ROOK" || rook.hasMoved) return false;

        const step = isKingSide?1:-1;
        for(let col = from.column +step;col != rookCol;col += step){
            if(this._board.getPiece(new Position(row,col))){
                return false
            }
        }

        for(let col = from.column+step;col !== to.column+step;col += step){
            const testBoard = this._board.clone();
            testBoard.move(from,new Position(row,col))
            if(CheckService.isKingInCheck(king.color,testBoard)){
                return false
            }
        }
        return true

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

        if(piece.type =="PAWN"){
            const direction = piece.color == "WHITE"?-1:1;
            if(Math.abs(to.row - from.row) === 2){
                this._board.setEnPassantTarget(from.offset(direction, 0));
            }
        }

        const ep = this._board.getEnPassantTarget();

        if (piece.type === "PAWN" && ep && to.equals(ep)){
            const direction  = piece.color == "WHITE"?-1:1;
            const capturedPawnP= to.offset(direction,0);
            this._board.setPiece(capturedPawnP,null)
         }

      if(piece.type == "KING" && Math.abs(to.column - from.column)===2){

        if(!this.canCastle(from,to)){
            throw new Error("Illegal Castling")
        }
        this.performCastling(from,to)

      }else{

        this._board.move(from,to)

        const movedPiece = this._board.getPiece(to);
        if (movedPiece) {
         movedPiece.hasMoved = true;
         }
        }
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
        if (
            piece.type !== "PAWN" ||
            Math.abs(to.row - from.row) !== 2
          ) {
            this._board.setEnPassantTarget(null);
          }
        this._currentTurn = this._currentTurn=== "WHITE"?"BLACK":"WHITE"


    }

    restore(data:{
        turn:"WHITE"|"BLACK";
        history:Move[];
    }):void{
        this._currentTurn = data.turn
        this._moveHistory = data.history
    }

    getSnapshot(){
        return{
            turn:this._currentTurn,
            history:[...this._moveHistory]
        }
    }
    
} 