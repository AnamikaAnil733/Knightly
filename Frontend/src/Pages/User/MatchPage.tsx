import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Chessboard } from "../../Components/User/Match/ChessBoard";
import { PlayerPanel } from "../../Components/User/Match/PlayerPanel";
import { MoveList } from "../../Components/User/Match/History";
import { ChatPanel } from "../../Components/User/Match/Chat";
import { ControlBar } from "../../Components/User/Match/ControlBar";
import { PromotionModal } from "../../Components/User/Match/PromotionModal";
import { GameOver } from "../../Components/User/Match/GameOver";
import { ResignModal } from "../../Components/User/Match/ResignModal";
import { DrawOfferModal } from "../../Components/User/Match/DrawOfferModal";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";

import { socket } from "../../Service/Socket";

import {
  createGameUrl,
  getGame,
  getLegalMoves,
} from "../../Service/Api/ChessApi";

import { BoardGrid } from "../../Types/Chess";

type Turn = "WHITE" | "BLACK";
type GameStatus =
  | "ACTIVE"
  | "CHECK"
  | "CHECKMATE"
  | "STALEMATE"
  | "WHITE_TIMEOUT"
  | "BLACK_TIMEOUT"
  | "WHITE_RESIGNED"
  | "BLACK_RESIGNED"
  | "DRAW_BY_REPETITION"
  | "DRAW_BY_FIFTY_MOVES"
  | "DRAW_BY_INSUFFICIENT_MATERIAL";

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
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [board, setBoard] = useState<BoardGrid>([]);
  const [turn, setTurn] = useState<Turn>("WHITE");
  const [history, setHistory] = useState<MoveDTO[]>([]);
  const [status, setStatus] = useState<GameStatus>("ACTIVE");
  const [promotion, setPromotion] = useState<{
    from: { row: number; col: number };
    to: { row: number; col: number };
    color: "WHITE" | "BLACK";
  } | null>(null);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(
    null
  );
  const [legalMoves, setLegalMoves] = useState<
    { row: number; col: number; type: "NORMAL" | "EN_PASSANT" }[]
  >([]);

  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [isDrawOfferModalOpen, setIsDrawOfferModalOpen] = useState(false);
  const [ratingDelta, setRatingDelta] = useState<number | null>(null);

  const [myRole, setMyRole] = useState<"WHITE" | "BLACK" | "SPECTATOR" | null>(
    null
  );
  const myRoleRef = useRef(myRole);
  useEffect(() => {
    myRoleRef.current = myRole;
  }, [myRole]);

  const [whiteTime, setWhiteTime] = useState<number>(0);
  const [blackTime, setBlackTime] = useState<number>(0);
  const [whitePlayer, setWhitePlayer] = useState<{
    name: string;
    rating: number;
    avatar: string | null;
  } | null>(null);
  const [blackPlayer, setBlackPlayer] = useState<{
    name: string;
    rating: number;
    avatar: string | null;
  } | null>(null);
  const lastUpdate = useRef<number>(0);
  const serverWhite = useRef<number>(0);
  const serverBlack = useRef<number>(0);

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

      if (game.newRatings) {
        setWhitePlayer((prev) =>
          prev ? { ...prev, rating: game.newRatings.white } : null
        );
        setBlackPlayer((prev) =>
          prev ? { ...prev, rating: game.newRatings.black } : null
        );

        if (myRoleRef.current === "WHITE") setRatingDelta(game.newRatings.whiteDelta);
        if (myRoleRef.current === "BLACK") setRatingDelta(game.newRatings.blackDelta);
      }

      serverWhite.current = game.clock.whiteTime;
      serverBlack.current = game.clock.blackTime;
      lastUpdate.current = Date.now();
      setWhiteTime(game.clock.whiteTime);
      setBlackTime(game.clock.blackTime);

      setSelected(null);
      setLegalMoves([]);
    });

    socket.on("drawOffered", () => {
      setIsDrawOfferModalOpen(true);
    });

    socket.on("roleAssigned", (role: "WHITE" | "BLACK" | "SPECTATOR") => {
      console.log("Assigned role:", role);
      setMyRole(role);
    });

    return () => {
      socket.off("gameUpdated");
      socket.off("moveError");
      socket.off("roleAssigned");
      socket.off("drawOffered");
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
      setStatus(game.status);

      serverWhite.current = game.clock.whiteTime;
      serverBlack.current = game.clock.blackTime;
      lastUpdate.current = Date.now();
      setWhiteTime(game.clock.whiteTime);
      setBlackTime(game.clock.blackTime);
      setWhitePlayer(game.whitePlayer);
      setBlackPlayer(game.blackPlayer);
    };

    init();
  }, [gameId, navigate]);

  useEffect(() => {
    if (status !== "ACTIVE" && status !== "CHECK") return;

    const interval = setInterval(() => {
      if (lastUpdate.current === 0) return;
      const elapsed = Date.now() - lastUpdate.current;
      if (turn === "WHITE") {
        const remaining = Math.max(serverWhite.current - elapsed, 0);
        setWhiteTime(remaining);
        setBlackTime(serverBlack.current);
        if (remaining === 0) {
          socket.emit("checkTimeout", gameId);
        }
      } else {
        const remaining = Math.max(serverBlack.current - elapsed, 0);
        setBlackTime(remaining);
        setWhiteTime(serverWhite.current);
        if (remaining === 0) {
          socket.emit("checkTimeout", gameId);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [turn, status, gameId]);

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
    const isLegal = legalMoves.some((m) => m.row === row && m.col === col);

    if (!isLegal) {
      setSelected(null);
      setLegalMoves([]);
      return;
    }

    const piece = board[selected.row][selected.col];

    const Promotion =
      piece?.type === "PAWN" &&
      ((piece.color === "WHITE" && row === 0) ||
        (piece.color === "BLACK" && row === 7));
    if (Promotion) {
      setPromotion({
        from: selected,
        to: { row, col },
        color: piece.color,
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

  const handleResign = () => {
    if (!gameId || myRole === "SPECTATOR" || (status !== "ACTIVE" && status !== "CHECK")) return;
    setIsResignModalOpen(true);
  };

  const confirmResign = () => {
    if (!gameId) return;
    socket.emit("resign", gameId);
  };

  const handleOfferDraw = () => {
    if (!gameId || myRole === "SPECTATOR" || (status !== "ACTIVE" && status !== "CHECK")) return;
    socket.emit("offerDraw", gameId);
  };

  const confirmAcceptDraw = () => {
    if (!gameId) return;
    socket.emit("acceptDraw", gameId);
  };

  if (!gameId || board.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    return `${mm}:${ss}`;
  };

  const orientation = myRole === "BLACK" ? "black" : "white";

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0A0F2C] to-[#1B1452] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full px-6 py-3 bg-[#11193F]/40 backdrop-blur-sm border-b border-[#FFD166]/20 shrink-0 z-50">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold text-[#FFD166] tracking-tight">
            Knightly
          </h1>
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
                name={
                  myRole === "BLACK"
                    ? whitePlayer?.name || "White"
                    : blackPlayer?.name || "Black"
                }
                rating={
                  myRole === "BLACK"
                    ? whitePlayer?.rating || 0
                    : blackPlayer?.rating || 0
                }
                avatar={
                  myRole === "BLACK"
                    ? whitePlayer?.avatar || ""
                    : blackPlayer?.avatar || ""
                }
                time={formatTime(myRole === "BLACK" ? whiteTime : blackTime)}
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
                  board={board}
                  selectedSquare={selected}
                  legalMoves={legalMoves}
                  onSquareClick={handleSquareClick}
                  orientation={orientation}
                />
              </div>

              {/* Overlays */}
              {status !== "ACTIVE" && status !== "CHECK" && (
                <GameOver status={status} turn={turn} myRole={myRole} ratingDelta={ratingDelta} />
              )}

              {promotion && (
                <PromotionModal
                  color={promotion.color}
                  onSelect={async (type) => {
                    if (!gameId) return;
                    socket.emit("move", {
                      gameId,
                      from: promotion.from,
                      to: promotion.to,
                      promotionType: type,
                    });
                    setPromotion(null);
                    setSelected(null);
                    setLegalMoves([]);
                  }}
                />
              )}

              <ResignModal
                isOpen={isResignModalOpen}
                onClose={() => setIsResignModalOpen(false)}
                onConfirm={confirmResign}
              />

              <DrawOfferModal
                isOpen={isDrawOfferModalOpen}
                onClose={() => setIsDrawOfferModalOpen(false)}
                onConfirm={confirmAcceptDraw}
              />
            </div>

            {/* Bottom Player (You) */}
            <div className="w-full max-w-[800px] shrink-0">
              <PlayerPanel
                name={
                  myRole === "BLACK"
                    ? blackPlayer?.name || "You"
                    : whitePlayer?.name || "You"
                }
                rating={
                  myRole === "BLACK"
                    ? blackPlayer?.rating || 0
                    : whitePlayer?.rating || 0
                }
                avatar={
                  myRole === "BLACK"
                    ? blackPlayer?.avatar || ""
                    : whitePlayer?.avatar || ""
                }
                time={formatTime(myRole === "BLACK" ? blackTime : whiteTime)}
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
            <ChatPanel gameId={gameId || ""} senderName={user?.displayname || "Observer"} />
          </div>

          {/* Controls: Bottom Section */}
          <div className="shrink-0 p-4 bg-[#0A0F2C]/40">
            <ControlBar onResign={handleResign} onDraw={handleOfferDraw} />
          </div>
        </div>

        {/* Mobile/Tablet View for Sidebar */}
        <div className="lg:hidden w-full flex flex-col gap-4 p-4 bg-[#0A0F2C]">
          <div className="flex justify-center">
            <ControlBar onResign={handleResign} onDraw={handleOfferDraw} />
          </div>
          <div className="h-64">
            <MoveList history={history} status={status} />
          </div>
          <div className="h-64">
            <ChatPanel gameId={gameId || ""} senderName={user?.displayname || "Observer"} />
          </div>
        </div>
      </div>
    </div>
  );
}
