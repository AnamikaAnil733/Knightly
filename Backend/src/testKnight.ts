import {Board} from "./Domain/Chess/Entities/Board";
import { Position } from "./Domain/Chess/Position";
import { Knight } from "./Domain/Chess/Pieces/Knight";
import { Rook } from "./Domain/Chess/Pieces/Rook";
import { Bishop } from "./Domain/Chess/Pieces/Bishop";
import { Queen } from "./Domain/Chess/Pieces/Queen";
import { King } from "./Domain/Chess/Pieces/King";
import { CheckService } from "./Domain/Chess/Service/CheckService";
import { LegalService } from "./Domain/Chess/Service/LegalMoveService";
import { GameState } from "./Domain/Chess/Game/GameState";

const board = new Board();
// const knight = new Knight("WHITE");
// const rook = new Rook("BLACK")
// const bishop = new Bishop("WHITE")
// const queen = new Queen("BLACK")
// const king = new King("WHITE")


// const from = new Position(4, 4);
// const f = new Position(4,1);

// board.setPiece(from, knight);
// board.setPiece(f, bishop);
// board.setPiece(from,queen)
// board.setPiece(f,king)
// board.setPiece(f,rook)

// board.setPiece(new Position(7, 4), king);
// board.setPiece(new Position(7, 0), rook);



board.setPiece(new Position(0, 4), new King("BLACK")); // e8
board.setPiece(new Position(7, 4), new King("WHITE")); // e1
board.setPiece(new Position(7, 7), new Rook("WHITE")); // h1

const game = new GameState(board);

game.makeMove(
  new Position(7, 4), // e1
  new Position(7, 6)  // g1
);

console.log(game.getHistory());




// const legalMoves = LegalService.getLegalMove(
//   new Position(0, 4),
//   board
// );

// console.log("Legal bishop moves:", legalMoves.map(m => m.toString()));

// const moves = knight.getLegalMoves(from, board);
// const moves = king.getPseudoLegalMoves(f, board);
// console.log(
//     moves.map(m => m.toString())
//   );
  // console.log(
  //   "White in check:",
  //   CheckService.isKingInCheck("WHITE", board)
  // );
  
