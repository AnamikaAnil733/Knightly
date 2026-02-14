import { Board } from "./Entities/Board";
import { Pawn } from "./Pieces/Pawn";
import { Rook } from "./Pieces/Rook";
import { Bishop } from "./Pieces/Bishop";
import { Knight } from "./Pieces/Knight";
import { Queen } from "./Pieces/Queen";
import { King } from "./Pieces/King";
import { Position } from "./Position";



export class InitialBoard{
  static create():Board{
    const board = new Board();
    for(let i =0;i<8;i++){
      board.setPiece(new Position(6,i),new Pawn("WHITE"));
      board.setPiece(new Position(1,i),new Pawn("BLACK"));
    }

    board.setPiece(new Position(0,0),new Rook("BLACK"));
    board.setPiece(new Position(0,7),new Rook("BLACK"));
    board.setPiece(new Position(7,0),new Rook("WHITE"));
    board.setPiece(new Position(7,7),new Rook("WHITE"));

    board.setPiece(new Position(0,1),new Knight("BLACK"));
    board.setPiece(new Position(0,6),new Knight("BLACK"));
    board.setPiece(new Position(7,1),new Knight("WHITE"));
    board.setPiece(new Position(7,6),new Knight("WHITE"));

    board.setPiece(new Position(0,2),new Bishop("BLACK"));
    board.setPiece(new Position(0,5),new Bishop("BLACK"));
    board.setPiece(new Position(7,2),new Bishop("WHITE"));
    board.setPiece(new Position(7,5),new Bishop("WHITE"));

    board.setPiece(new Position(0,3),new Queen("BLACK"));
    board.setPiece(new Position(7,3),new Queen("WHITE"));

    board.setPiece(new Position(0,4),new King("BLACK"));
    board.setPiece(new Position(7,4),new King("WHITE"));

    return board;
  }
}
