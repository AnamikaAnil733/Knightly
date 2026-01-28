import { Position } from "../Position";
import { Piece } from "../Pieces/Piece";

export class Board{
    private  grid:(Piece |null)[][];
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


    clone():Board{
        return new Board(this.grid)
    }

}