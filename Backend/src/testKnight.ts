import {Board} from "./Domain/Chess/Entities/Board";
import { Position } from "./Domain/Chess/Position";
import { Knight } from "./Domain/Chess/Pieces/Knight";
import { Rook } from "./Domain/Chess/Pieces/Rook";
import { Bishop } from "./Domain/Chess/Pieces/Bishop";
import { Queen } from "./Domain/Chess/Pieces/Queen";
import { King } from "./Domain/Chess/Pieces/King";

const board = new Board();
const knight = new Knight("WHITE");
const rook = new Rook("WHITE")
const bishop = new Bishop("WHITE")
const queen = new Queen("BLACK")
const king = new King("WHITE")


const from = new Position(4, 4);
const f = new Position(4,1);

// board.setPiece(from, knight);
board.setPiece(f, bishop);
board.setPiece(from,queen)
board.setPiece(f,king)
// board.setPiece(f,rook)



// const moves = knight.getLegalMoves(from, board);
const moves = king.getPseudoLegalMoves(f, board);
console.log(
    moves.map(m => m.toString())
  );
  
