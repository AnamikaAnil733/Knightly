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
import { Pawn } from "./Domain/Chess/Pieces/Pawn";

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



// board.setPiece(new Position(0, 4), new King("BLACK")); // e8
// board.setPiece(new Position(7, 4), new King("WHITE")); // e1
// board.setPiece(new Position(7, 7), new Rook("WHITE")); // h1

// const game = new GameState(board);

// game.makeMove(
//   new Position(7, 4), // e1
//   new Position(7, 6)  // g1
// );

// console.log(game.getHistory());




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



  
// Kings (required)
board.setPiece(new Position(7, 4), new King("WHITE")); // e1
board.setPiece(new Position(0, 4), new King("BLACK")); // e8

// Pawns
board.setPiece(new Position(3, 4), new Pawn("WHITE")); // e5
board.setPiece(new Position(1, 3), new Pawn("BLACK")); // d7




const game = new GameState(board);

// 1️⃣ White dummy move (because WHITE always starts)
game.makeMove(
  new Position(7, 4), // e1
  new Position(6, 4)  // e2
);

// 2️⃣ Black pawn moves two squares: d7 → d5
game.makeMove(
  new Position(1, 3), // d7
  new Position(3, 3)  // d5
);

// 3️⃣ White captures en passant: e5 → d6
game.makeMove(
  new Position(3, 4), // e5
  new Position(2, 3)  // d6
);

console.log(
  "White pawn at d6:",
  board.getPiece(new Position(2, 3))?.type
);

console.log(
  "Captured pawn removed:",
  board.getPiece(new Position(3, 3))
);

