import { Position } from "../Position";
import { Piece } from "../Pieces/Piece";
import { SerializedBoardGrid } from "../Types/SerializedBoard";
import { Pawn } from "../Pieces/Pawn";
import { Rook } from "../Pieces/Rook";
import { Bishop } from "../Pieces/Bishop";
import { Queen } from "../Pieces/Queen";
import { King } from "../Pieces/King";
import { Knight } from "../Pieces/Knight";

export class Board{
    private  grid:(Piece |null)[][];
    private _enPassantTarget: Position | null = null;
    constructor(grid?:(Piece |null)[][]){
        if(grid){
           this.grid = grid.map(row => [...row])
        }else{
            this.grid = Array.from({length:8},()=>
            Array.from({length:8},()=>null)
            )
        }
    }
    isInside(position:Position):boolean{
        return position.isValid();
    }
    
    getPiece(position:Position):Piece|null{
        if(!this.isInside(position)) return null;
      return this.grid[position.row][position.column]
    }

    setPiece(position:Position,piece:Piece|null):void{
        if(!this.isInside(position))return;
       this.grid[position.row][position.column] = piece
    }

    move(from:Position,to:Position):void{
        const piece = this.getPiece(from);
        if(!piece) return;
        this.setPiece(to,piece);
        this.setPiece(from,null)
    }


    clone(): Board {
        return Board.deserialize(this.serialize(), this._enPassantTarget);
      }
      

    setEnPassantTarget(pos: Position | null): void {
        this._enPassantTarget = pos;
      }
      
    getEnPassantTarget(): Position | null {
        return this._enPassantTarget;
      }


    serialize():SerializedBoardGrid{
    return this.grid.map(row =>
        row.map(piece=>{
            if(!piece) return null;
            return {
                type:piece.type,
                color:piece.color,
                hasMoved:piece.hasMoved ?? false
            }
        })
    )
    }

    static deserialize(data:SerializedBoardGrid,
        _enPassantTarget:Position |null = null
    ):Board{
        const board = new Board();
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                const cell = data[i][j]
                if(!cell)continue;
                let piece:Piece;

                switch (cell.type) {
                    case "PAWN": piece = new Pawn(cell.color); break;
                    case "ROOK": piece = new Rook(cell.color); break;
                    case "KNIGHT": piece = new Knight(cell.color); break;
                    case "BISHOP": piece = new Bishop(cell.color); break;
                    case "QUEEN": piece = new Queen(cell.color); break;
                    case "KING": piece = new King(cell.color); break;
                    default:
                      throw new Error(`Unknown piece type: ${cell.type}`);
                  }
            piece.hasMoved = cell.hasMoved ?? false;
            board.setPiece(new Position(i,j),piece)

            }
        }
        board.setEnPassantTarget(_enPassantTarget)
        return board
    }



}