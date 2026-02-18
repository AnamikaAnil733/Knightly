import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Chessboard } from "../../components/user/Match/ChessBoard";
import { PlayerPanel } from "../../components/user/Match/PlayerPanel";
import { MoveList } from "../../components/user/Match/History";
import { ChatPanel } from "../../components/user/Match/chat";
import { ControlBar } from "../../components/user/Match/controlBar";
import { PromotionModal } from "../../components/user/Match/PromotionModal";
import { GameOver } from "../../components/user/Match/GameOver";

import { socket } from "../../Service/socket";

import {
  createGameUrl,
  getGame,
  getLegalMoves,

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
    |null>(null);
  const [selected, setSelected] =
    useState<{ row: number; col: number } | null>(null);
  const [legalMoves, setLegalMoves] =
useState<{ row: number; col: number,type: "NORMAL" | "EN_PASSANT" }[]>([]);
  
  const [myRole, setMyRole] = useState<"WHITE" | "BLACK" | "SPECTATOR" | null>(null);

   //  Join socket room
   useEffect(() => {
    if (!gameId) return;

    socket.emit("joinGame", gameId);
  }, [gameId]);

  //Listen for real-time updates
  useEffect(() => {
    socket.on("gameUpdated", (game) => {
      setBoard(game.board);
      setTurn(game.turn);
      setHistory(game.history);
      setStatus(game.status);
      setSelected(null);
      setLegalMoves([]);
    });

    socket.on("roleAssigned", (role: "WHITE" | "BLACK" | "SPECTATOR") => {
        console.log("Assigned role:", role);
        setMyRole(role);
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("moveError");
      socket.off("roleAssigned");
    };
  }, []);
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

    // Prevent interaction if it's not your turn or you are a spectator
    if (myRole === "SPECTATOR") return;
    if (myRole && myRole !== turn) return;

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

    socket.emit("move", {
      gameId,
      from: selected,
      to: { row, col },
    });

    setSelected(null);
    setLegalMoves([]);
  };

  if (!gameId || board.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  const orientation = myRole === "BLACK" ? "black" : "white";

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0A0F2C] to-[#1B1452] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 py-3 bg-[#11193F]/40 backdrop-blur-sm border-b border-[#FFD166]/20 shrink-0 z-50">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold text-[#FFD166] tracking-tight">Knightly</h1>
          <span className="text-sm font-medium opacity-80 bg-[#ffffff]/10 px-3 py-1 rounded-full border border-[#ffffff]/10">
            {turn} to move
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT/CENTER: Game Area (Board + Players) */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 lg:p-4 overflow-hidden relative">
          
          <div className="flex flex-col items-center gap-2 w-full h-full justify-center max-w-[1200px]">
            {/* Top Player (Opponent) */}
            <div className="w-full max-w-[800px] shrink-0">
               <PlayerPanel
                 name={myRole === "BLACK" ? "White" : "Black"}
                 rating={2400}
                 avatar=""
                 time="5:32"
                 isOpponent
               />
            </div>

            {/* Chess Board */}
            {/* Flex-1 to take available space, aspect-square to keep shape, min-h-0 for flex scrolling */}
            <div className="relative flex-1 min-h-0 aspect-square max-w-full">
               <div
                  className={`relative w-full h-full transition-all duration-500 ${
                    status === "CHECKMATE" || status === "STALEMATE"
                      ? "blur-[2px] grayscale-[0.3]"
                      : ""
                  }`}
                >
                  <Chessboard
                    key={turn}
                    board={board}
                    selectedSquare={selected}
                    legalMoves={legalMoves}
                    onSquareClick={handleSquareClick}
                    orientation={orientation}
                  />
               </div>

               {/* Overlays */}
               {(status === "CHECKMATE" || status === "STALEMATE") && (
                 <GameOver status={status} turn={turn} myRole={myRole} />
               )}

               {promotion && (
                  <PromotionModal
                    color={promotion.color}
                    onSelect={async (type) => {
                      if (!gameId) return;
                      socket.emit("move", { gameId, from: promotion.from, to: promotion.to, promotionType: type });
                      setPromotion(null);
                      setSelected(null);
                      setLegalMoves([]);
                    }}
                  />
               )}
            </div>

            {/* Bottom Player (You) */}
            <div className="w-full max-w-[800px] shrink-0">
               <PlayerPanel
                 name={myRole === "SPECTATOR" ? "White" : "You"}
                 rating={2200}
                 avatar=""
                 time="6:15"
                 isYourTurn={myRole === turn}
                 isOpponent={false}
               />
            </div>
            
          </div>
        </div>

        {/* RIGHT: Sidebar (Moves + Chat + Controls) */}
        <div className="hidden lg:flex w-96 flex-col bg-[#11193F]/30 border-l border-[#ffffff]/10 h-full shrink-0 backdrop-blur-sm">
            {/* Moves: Top Section */}
            <div className="flex-1 min-h-0 border-b border-[#ffffff]/10 p-4">
                 <MoveList history={history} status={status} />
            </div>

            {/* Chat: Middle Section */}
            <div className="flex-1 min-h-0 border-b border-[#ffffff]/10 p-4">
                 <ChatPanel />
            </div>
            
            {/* Controls: Bottom Section */}
            <div className="shrink-0 p-4 bg-[#0A0F2C]/40">
                <ControlBar />
            </div>
        </div>

        {/* Mobile/Tablet View for Sidebar */}
        <div className="lg:hidden w-full flex flex-col gap-4 p-4 bg-[#0A0F2C]">
          <div className="flex justify-center"><ControlBar /></div>
          <div className="h-64"><MoveList history={history} status={status} /></div>
          <div className="h-64"><ChatPanel /></div>
        </div>
      </div>
    </div>
  );
}
