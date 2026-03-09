import { Server, Socket } from "socket.io";
import { IMakeMoveUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/IMakeMoveUseCase";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { IMatchmakingUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/IMatchmakingUseCase";
import { ICreateGameUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/ICreateGameUseCase";

import { RatingUpdateService } from "../../Domain/Chess/Service/RatingUpdateService";
import { IUserRepository } from "../../Domain/Interface/Repositories/IUserRepository";
import { TIME_CONTROLS } from "../../Domain/Chess/Types/GameFormat";

export class SocketHandler {
  private rooms = new Map<string, { white?: string; black?: string }>();

  constructor(
    private readonly _io: Server,
    private readonly _makeMoveUseCase: IMakeMoveUseCase,
    private readonly _gameRepo: IChessGameRepository,
    private readonly _matchmakingUseCase: IMatchmakingUseCase,
    private readonly _createGameUseCase: ICreateGameUseCase,
    private readonly _userRepo: IUserRepository,
    private readonly _ratingUpdateService: RatingUpdateService
  ) {}

  private async finalizeGame(game: any) {
    const status = game.getStatus();
    let ratings = null;

    if (status !== "ACTIVE" && status !== "CHECK") {
      try {
        ratings = await this._ratingUpdateService.updateRatings(game);
        await this._gameRepo.update(game);
        console.log(`Ratings updated and persisted for game ${game.id}`);
      } catch (error) {
        console.error("Error updating ratings in finalizeGame:", error);
      }
    }

    const updatedState = game.getGameState();
    const clock = game.getClock();
    const liveTimes = clock.getLiveTimes();

    const timeControl = game.getTimeControl();
    const config = TIME_CONTROLS[timeControl] || TIME_CONTROLS["5+0"];
    const ratingMode = config.mode;

    this._io.to(game.id).emit("gameUpdated", {
      board: updatedState.getBoard().serialize(),
      turn: updatedState.getTurn(),
      history: updatedState.getHistory().map((move: any) => ({
        from: { row: move.from.row, col: move.from.column },
        to: { row: move.to.row, col: move.to.column },
        piece: move.pieceType,
        color: move.color,
        promotion: move.promotionType ?? undefined,
      })),
      status: status,
      timeControl: timeControl,
      modeName: ratingMode,
      clock: {
        whiteTime: liveTimes.whiteTime,
        blackTime: liveTimes.blackTime,
        increment: clock.increment,
        turn: clock.turn,
      },
      newRatings: ratings ? {
        white: ratings.whiteNew,
        black: ratings.blackNew,
        whiteDelta: ratings.whiteDelta,
        blackDelta: ratings.blackDelta
      } : null
    });
  }

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log("socket connected", socket.id);

      socket.on("checkTimeout", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (
            !game ||
            (game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK")
          )
            return;

          if (game.checkPassiveTimeout()) {
            await this._gameRepo.update(game);
            await this.finalizeGame(game);
          }
        } catch (error) {
          console.error("Timeout check error:", error);
        }
      });

      socket.on("findMatch", async (userId: string, gameFormat: string = "3+0") => {
        try {
          const user = (await this._userRepo.findById(userId)) as any;
          if (!user) return;

          const config = TIME_CONTROLS[gameFormat] || TIME_CONTROLS["5+0"];
          const ratingMode = config.mode;

          // Try to get rating for specific format
          const rating = user.getRating
            ? user.getRating(ratingMode)
            : user.rating?.[ratingMode] || 300;

          const result = await this._matchmakingUseCase.findMatch({
            userId,
            socketId: socket.id,
            rating,
            joinedAt: Date.now(),
            timeControl: gameFormat,
          });

          if (result.type === "WAITING") {
            socket.emit("waiting", {
              queueSize: this._matchmakingUseCase.getQueueSizeFor(gameFormat),
              format: gameFormat
            });
            return;
          }

          if (result.type === "MATCH_FOUND") {
            const { gameId, white, black } = result;

            this.rooms.set(gameId, {
              white: white.socketId,
              black: black.socketId,
            });

            this._io.sockets.sockets.get(white.socketId)?.join(gameId);
            this._io.sockets.sockets.get(black.socketId)?.join(gameId);

            this._io.to(white.socketId).emit("matchFound", {
              gameId,
              role: "WHITE",
            });

            this._io.to(black.socketId).emit("matchFound", {
              gameId,
              role: "BLACK",
            });

            console.log("Match created:", gameId);
          }
        } catch (error) {
          console.error("Matchmaking error:", error);
        }
      });

      socket.on("cancelSearch", () => {
        this._matchmakingUseCase.removeFromQueue(socket.id);
        socket.emit("searchCancelled");
      });

      socket.on("joinGame", (gameId: string) => {
        socket.join(gameId);

        if (!this.rooms.has(gameId)) {
          this.rooms.set(gameId, {});
        }

        const room = this.rooms.get(gameId)!;

        let role: "WHITE" | "BLACK" | "SPECTATOR";

        // Prioritize existing assignment (from matchmaking)
        if (room.white === socket.id) {
          role = "WHITE";
        } else if (room.black === socket.id) {
          role = "BLACK";
        }
        // Otherwise fill empty seats (direct joins)
        else if (!room.white) {
          room.white = socket.id;
          role = "WHITE";
        } else if (!room.black) {
          room.black = socket.id;
          role = "BLACK";
        } else {
          role = "SPECTATOR";
        }

        socket.emit("roleAssigned", role);

        console.log(`Socket ${socket.id} joined ${gameId} as ${role}`);
      });

      socket.on("sendMessage", ({ gameId, sender, text }) => {
        if (!gameId || !text || !sender) return;
        
        console.log(`Chat in ${gameId}: ${sender}: ${text}`);
        
        // Broadcast message to everyone in the game room
        this._io.to(gameId).emit("messageReceived", {
          sender,
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          socketId: socket.id
        });
      });

      socket.on("resign", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (
            !game ||
            (game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK")
          )
            return;

          const room = this.rooms.get(gameId);
          if (!room) return;

          let status: any;
          if (room.white === socket.id) {
            status = "WHITE_RESIGNED";
          } else if (room.black === socket.id) {
            status = "BLACK_RESIGNED";
          } else {
            return;
          }

          game.setStatus(status);
          game.getClock().stop();
          await this._gameRepo.update(game);
          await this.finalizeGame(game);
        } catch (error) {
          console.error("Resign error:", error);
        }
      });

      socket.on("offerDraw", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (!game || (game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK")) return;

          const room = this.rooms.get(gameId);
          if (!room) return;

          // Find the opponent's socket
          const opponentSocketId = room.white === socket.id ? room.black : room.white;
          if (opponentSocketId) {
            this._io.to(opponentSocketId).emit("drawOffered");
          }
        } catch (error) {
          console.error("Offer draw error:", error);
        }
      });

      socket.on("acceptDraw", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (!game || (game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK")) return;

          game.setStatus("DRAW_BY_AGREEMENT" as any);
          game.getClock().stop();
          await this._gameRepo.update(game);
          await this.finalizeGame(game);
        } catch (error) {
          console.error("Accept draw error:", error);
        }
      });


      socket.on("rematchrequest", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (!game) return;

          // Only allow rematch if the game is finished
          const status = game.getStatus();
          if (status === "ACTIVE" || status === "CHECK") {
            console.log(`Rematch rejected: Game ${gameId} is still ${status}`);
            return;
          }

          const room = this.rooms.get(gameId);
          if (!room) return;

          const opponentSocketId =
            room.white === socket.id ? room.black : room.white;
          if (opponentSocketId) {
            this._io.to(opponentSocketId).emit("rematchOffered");
          }
        } catch (error) {
          console.error("Rematch request error", error);
        }
      });

      socket.on("acceptRematch", async (gameId: string) => {
        try {
          const oldGame = await this._gameRepo.findById(gameId);
          if (!oldGame) return;

          const room = this.rooms.get(gameId);
          if (!room || !room.white || !room.black) return;

          // Swap colors for rematch
          const newWhiteSocketId = room.black;
          const newBlackSocketId = room.white;

          const whitePlayerId = oldGame.getWhitePlayerId();
          const blackPlayerId = oldGame.getBlackPlayerId();

          // Players in the new game (swapped)
          const newWhitePlayerId = blackPlayerId;
          const newBlackPlayerId = whitePlayerId;

          const { gameId: newGameId } = await this._createGameUseCase.execute(
            newWhitePlayerId,
            newBlackPlayerId,
            oldGame.getTimeControl()
          );

          // Update rooms map for the new game
          this.rooms.set(newGameId, {
            white: newWhiteSocketId,
            black: newBlackSocketId,
          });

          // Join both players to the new socket room
          const whiteSocket = this._io.sockets.sockets.get(newWhiteSocketId);
          const blackSocket = this._io.sockets.sockets.get(newBlackSocketId);

          if (whiteSocket) whiteSocket.join(newGameId);
          if (blackSocket) blackSocket.join(newGameId);

          // Notify players about the new match
          this._io.to(newWhiteSocketId).emit("matchFound", {
            gameId: newGameId,
            role: "WHITE",
          });

          this._io.to(newBlackSocketId).emit("matchFound", {
            gameId: newGameId,
            role: "BLACK",
          });

          console.log(`Rematch created: ${newGameId} for players ${newWhitePlayerId} and ${newBlackPlayerId}`);
        } catch (error) {
          console.error("Accept rematch error:", error);
        }
      });

      socket.on("move", async ({ gameId, from, to, promotionType }) => {
        try {
          const room = this.rooms.get(gameId);
          if (!room) return;

          let playerColor: "WHITE" | "BLACK" | null = null;

          if (room.white === socket.id) playerColor = "WHITE";
          if (room.black === socket.id) playerColor = "BLACK";

          if (!playerColor) {
            socket.emit("moveError", "Spectators cannot move");
            return;
          }
          const game = await this._gameRepo.findById(gameId);
          if (!game) return;

          const gameState = game.getGameState();

          if (gameState.getTurn() !== playerColor) {
            socket.emit("moveError", "Not your Turn");
            return;
          }

          const updatedGame = await this._makeMoveUseCase.execute(gameId, from, to, promotionType);

          // Passive timeout check
          if (updatedGame.checkPassiveTimeout()) {
            await this._gameRepo.update(updatedGame);
          }

          console.log(
            `Broadcasting update for ${gameId}. Status: ${updatedGame.getStatus()}`
          );

          await this.finalizeGame(updatedGame);
        } catch (err) {
          console.error("Move processing error:", err);
          socket.emit("moveError", (err as Error).message);
        }
      });
      socket.on("disconnect", () => {
        this._matchmakingUseCase.removeFromQueue(socket.id);

        for (const [gameId, room] of this.rooms.entries()) {
          if (room.white === socket.id) {
            room.white = undefined;
          }
          if (room.black === socket.id) {
            room.black = undefined;
          }
        }
        console.log("Socket disconnected", socket.id);
      });
    });
  }
}
