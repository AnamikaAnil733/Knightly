

import { Board } from "./Domain/Chess/Entities/Board";
import { GameState } from "./Domain/Chess/Game/GameState";
import { Position } from "./Domain/Chess/Position";
import { Pawn } from "./Domain/Chess/Pieces/Pawn";
import { King } from "./Domain/Chess/Pieces/King";


console.log("=== EN PASSANT DEBUG START ===");

// Setup board
const board = new Board();
board.setPiece(new Position(7, 4), new King("WHITE")); // e1
board.setPiece(new Position(0, 4), new King("BLACK")); // e8


// White pawn on e2
board.setPiece(new Position(6, 4), new Pawn("WHITE"));

// Black pawn on d4
board.setPiece(new Position(4, 3), new Pawn("BLACK"));


const game = new GameState(board);

// White double-step e2 → e4
console.log("WHITE moves e2 → e4");
game.makeMove(
  new Position(6, 4),
  new Position(4, 4)
);

// Check en passant target
const epTarget = game.getBoard().getEnPassantTarget();
console.log("EP TARGET AFTER DOUBLE MOVE:", epTarget);

// Black pawn legal moves
const blackMoves = game.getLegalMove(new Position(4, 3));
console.log("BLACK PAWN LEGAL MOVES:", blackMoves);

// Check manually
let hasEP = false;
for (const m of blackMoves) {
  if (m.row === 5 && m.column === 4) {
    hasEP = true;
  }
}

console.log("EN PASSANT MOVE PRESENT?", hasEP);

console.log("=== EN PASSANT DEBUG END ===");