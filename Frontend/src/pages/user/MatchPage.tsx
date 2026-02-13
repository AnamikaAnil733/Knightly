import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Chessboard } from "../../components/user/Match/ChessBoard";
import { PlayerPanel } from "../../components/user/Match/PlayerPanel";
import { MoveList } from "../../components/user/Match/History";
import { ChatPanel } from "../../components/user/Match/chat";
import { ControlBar } from "../../components/user/Match/controlBar";
import { PromotionModal } from "../../components/user/Match/PromotionModal";
import { GameOver } from "../../components/user/Match/GameOver";

import {
  createGameUrl,
  getGame,
  getLegalMoves,
  makeMove,
} from "../../Service/api/chessApi";

import { BoardGrid } from "../../types/chess";

type Turn = "WHITE" | "BLACK";
type GameStatus = "ACTIVE" | "CHECK" | "CHECKMATE" | "STALEMATE";

type Position = { row: number; col: number };

type MoveDTO = {
  from: Position;
  to: Position;
  piece: string;
  color: "WHITE" | "BLACK";
  promotion?: string;
};

export function Match() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const [board, setBoard] = useState<BoardGrid>([]);
  const [turn, setTurn] = useState<Turn>("WHITE");
  const [history, setHistory] = useState<MoveDTO[]>([]);
  const [status, setStatus] = useState<GameStatus>("ACTIVE");
  const [promotion,setPromotion] = useState<{
    from:{row:number;col:number},
    to:{row:number;col:number},
    color:"WHITE"|"BLACK";}
    |null>(null)

  const [selected, setSelected] =
    useState<{ row: number; col: number } | null>(null);

  const [legalMoves, setLegalMoves] =
    useState<{ row: number; col: number,type: "NORMAL" | "EN_PASSANT" }[]>([]);
  useEffect(() => {
    const init = async () => {
      // If no gameId → create game
      if (!gameId) {
        const newGameId = await createGameUrl();
        navigate(`/match/${newGameId}`, { replace: true });
        return;
      }

      // load game
      const game = await getGame(gameId);
      setBoard(game.board);
      setTurn(game.turn);
      setHistory(game.history);
      setStatus(game.status)
    };

    init();
  }, [gameId, navigate]);

  const handleSquareClick = async (row: number, col: number) => {
    if (!gameId) return;

    // First click → select piece
    if (!selected) {
      const piece = board[row][col];

      // Allow only current turn piece
      if (!piece || piece.color !== turn) return;

      const moves = await getLegalMoves(gameId, row, col);
      if (moves.length === 0) return;

      setSelected({ row, col });
      setLegalMoves(moves);
      return;
    }

    // Second click → move
    const isLegal = legalMoves.some(
      (m) => m.row === row && m.col === col
    );

    if (!isLegal) {
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    const piece = board[selected.row][selected.col]

    const Promotion = piece?.type === "PAWN" && ((piece.color === "WHITE" && row ===0)||(piece.color === "BLACK" && row === 7));
    if(Promotion){
      setPromotion({
        from:selected,
        to:{row,col},
        color:piece.color
      });
      return;
    }

    await makeMove(gameId, selected, { row, col });

    // Re-sync game state
    const game = await getGame(gameId);
    setBoard(game.board);
    setTurn(game.turn);
    setHistory(game.history);
    setStatus(game.status)
    setSelected(null);
    setLegalMoves([]);
  };


  useEffect(() => {
    setSelected(null);
    setLegalMoves([]);
  }, [turn]);


  if (!gameId || board.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0A0F2C] to-[#1B1452] flex flex-col">
      {/* Header */}
      <div className="w-full px-8 py-4 bg-[#11193F]/40 backdrop-blur-sm border-b border-[#FFD166]/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold text-[#FFD166]">Knightly</h1>
          <span className="text-sm opacity-80">
            {turn} to move
          </span>
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

            {/*key={turn} forces clean re-render */}
            <div
  className={`relative transition-all duration-300 ${
    status === "CHECKMATE" || status === "STALEMATE"
      ? "blur-[6px] scale-[0.98] opacity-80"
      : ""
  }`}
>
            <Chessboard
              key={turn}
              board={board}
              selectedSquare={selected}
              legalMoves={legalMoves}
              onSquareClick={handleSquareClick}
            />
            </div>
{(status === "CHECKMATE" || status === "STALEMATE") && (
  <GameOver status={status} turn={turn} />
)}


            {promotion && (
  <PromotionModal
    color={promotion.color}
    onSelect={async (type) => {
      if (!gameId) return;

      await makeMove(
        gameId,
        promotion.from,
        promotion.to,
        type   // 🔥 send promotionType
      );

      const game = await getGame(gameId);
      setBoard(game.board);
      setTurn(game.turn);
      setHistory(game.history);
      setStatus(game.status);

      setPromotion(null);
      setSelected(null);
      setLegalMoves([]);
    }}
  />
)}

            

            <PlayerPanel
              name="You"
              rating={2200}
              avatar=""
              time="6:15"
              isYourTurn={turn === "WHITE"}
            />

            <ControlBar />
          </div>

          <MoveList history={history} status={status}  />
        </div>
      </div>
    </div>
  );
}
