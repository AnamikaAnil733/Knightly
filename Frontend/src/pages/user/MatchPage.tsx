import { useEffect, useState } from "react";
import { Chessboard } from "../../components/user/Match/ChessBoard";
import { PlayerPanel } from "../../components/user/Match/PlayerPanel";
import { MoveList } from "../../components/user/Match/History";
import { ChatPanel } from "../../components/user/Match/chat";
import { ControlBar } from "../../components/user/Match/controlBar";

import { createGameUrl ,getGame} from "../../Service/api/chessApi";


import { BoardGrid } from "../../types/chess";

export function Match() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardGrid>([]);
  // const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  // const [legalMoves, setLegalMoves] = useState<{ row: number; col: number }[]>([]);

  // 1️⃣ Create game on mount
  useEffect(() => {
    const init = async () => {
      const id = await createGameUrl();
      setGameId(id);

      const game = await getGame(id);
      console.log(game)
      setBoard(game.board);
    };

    init();
  }, []);

// //   // 2️⃣ Handle square click
//   const handleSquareClick = async (row: number, col: number) => {
//     if (!gameId) return;

//     // First click → select piece
//     if (!selected) {
//       const moves = await getLegalMoves(gameId, row, col);
//       setSelected({ row, col });
//       setLegalMoves(moves);
//       return;
//     }

//     // Second click → move
//     await makeMove(gameId, selected, { row, col });

//     const game = await getGame(gameId);
//     setBoard(game.board);

//     // Reset UI state
//     setSelected(null);
//     setLegalMoves([]);
//   };

  // 3️⃣ Prevent render until board loads
  if (!gameId || board.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Creating game...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0A0F2C] to-[#1B1452] flex flex-col">
      {/* Header */}
      <div className="w-full px-8 py-4 bg-[#11193F]/40 backdrop-blur-sm border-b border-[#FFD166]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold text-[#FFD166]">Knightly</h1>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl flex gap-6">
          <ChatPanel />

          <div className="flex-1 flex flex-col items-center gap-6">
            <PlayerPanel
              name="Opponent"
              rating={2400}
              avatar=""
              time="5:32"
              isOpponent
            />

            <Chessboard
              board={board}
              // selectedSquare={selected}
              // legalMoves={legalMoves}
            //   onSquareClick={handleSquareClick}
            />

            <PlayerPanel
              name="You"
              rating={2200}
              avatar=""
              time="6:15"
              isYourTurn
            />

            <ControlBar />
          </div>

          <MoveList />
        </div>
      </div>
    </div>
  );
}
