import { Server, Socket } from "socket.io";
import { IMakeMoveUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/IMakeMoveUseCase";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { IMatchmakingUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/IMatchmakingUseCase";
import { ICreateGameUseCase } from "../../Domain/Interface/Usecases/User/GameManagement/ICreateGameUseCase";

import { RatingUpdateService } from "../../Domain/Chess/Service/RatingUpdateService";
import { IUserRepository } from "../../Domain/Interface/Repositories/IUserRepository";
import { TIME_CONTROLS } from "../../Domain/Chess/Types/GameFormat";
import { StockfishService } from "../../Domain/Chess/Service/StockfishService";

export class SocketHandler {
  private rooms = new Map<string, { white?: string; black?: string }>();
  private userToSocket = new Map<string, string>();

  constructor(
    private readonly _io: Server,
    private readonly _makeMoveUseCase: IMakeMoveUseCase,
    private readonly _gameRepo: IChessGameRepository,
    private readonly _matchmakingUseCase: IMatchmakingUseCase,
    private readonly _createGameUseCase: ICreateGameUseCase,
    private readonly _userRepo: IUserRepository,
    private readonly _ratingUpdateService: RatingUpdateService,
    private readonly _stockfishService:StockfishService,
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

    const isBotMatch = game.getWhitePlayerId() === "stockfish-bot" || game.getBlackPlayerId() === "stockfish-bot";
    const modeName = isBotMatch ? "Play Computer" : config.mode;

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
      status,
      timeControl,
      modeName,
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
        blackDelta: ratings.blackDelta,
      } : null,
    });
  }

  public initialize() {
    this._io.on("connection", (socket: Socket) => {
      console.log("socket connected", socket.id);

      socket.on("identify", (userId: string) => {
        this.userToSocket.set(userId, socket.id);
        console.log(`User ${userId} identified with socket ${socket.id}`);
      });

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
              format: gameFormat,
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

      socket.on("playComputer", async (userId: string, gameFormat: string = "level-1", preferredColor: "WHITE" | "BLACK" | "RANDOM" = "RANDOM") => {
        try {
          let difficulty = 1;
          let timeControl = "NO_TIMER";

          if (gameFormat.startsWith("level-")) {
            difficulty = parseInt(gameFormat.split("-")[1]) || 1;
            timeControl = "NO_TIMER";
          }

          let playerRole: "WHITE" | "BLACK";
          if (preferredColor === "RANDOM") {
            playerRole = Math.random() < 0.5 ? "WHITE" : "BLACK";
          } else {
            playerRole = preferredColor;
          }

          const whitePlayerId = playerRole === "WHITE" ? userId : "stockfish-bot";
          const blackPlayerId = playerRole === "BLACK" ? userId : "stockfish-bot";

          const { gameId } = await this._createGameUseCase.execute(whitePlayerId, blackPlayerId, gameFormat, difficulty);

          this.rooms.set(gameId, {
            white: playerRole === "WHITE" ? socket.id : "bot-socket-placeholder",
            black: playerRole === "BLACK" ? socket.id : "bot-socket-placeholder",
          });

          socket.join(gameId);

          this._io.to(socket.id).emit("matchFound", {
            gameId,
            role: playerRole,
          });

          console.log(`Bot Match created: ${gameId} for user ${userId} as ${playerRole} at Level ${difficulty}`);

          // If bot is white, it should move first
          if (whitePlayerId === "stockfish-bot") {
            const botGame = await this._gameRepo.findById(gameId);
            if (botGame) {
              const state = botGame.getGameState();
              const skillLevel = Math.min(20, (difficulty - 1) * 4);

              this._stockfishService.getBestMove(state.getHistory(), skillLevel).then(async (bestMove) => {
                const updatedBotGame = await this._makeMoveUseCase.execute(
                  gameId,
                  { row: bestMove.from.row, col: bestMove.from.column },
                  { row: bestMove.to.row, col: bestMove.to.column },
                  bestMove.promotionType as any,
                );
                await this.finalizeGame(updatedBotGame);
              });
            }
          }
        } catch (error) {
          console.error("Bot Matchmaking error:", error);
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
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          socketId: socket.id,
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


      socket.on("invite_friend", ({ recipientId, senderId, senderName, gameFormat = "5+0" }) => {
        const recipientSocketId = this.userToSocket.get(recipientId);
        if (recipientSocketId) {
          this._io.to(recipientSocketId).emit("receive_friend_invite", {
            senderId,
            senderName: senderName || "A friend",
            gameFormat,
          });
          console.log(`Invite sent from ${senderId} to ${recipientId}`);
        } else {
          socket.emit("friend_offline", { recipientId });
        }
      });

      socket.on("accept_friend_invite", async ({ senderId, recipientId, gameFormat = "5+0" }) => {
        try {
          const senderSocketId = this.userToSocket.get(senderId);
          if (!senderSocketId) {
            socket.emit("invite_failed", "Sender is offline");
            return;
          }

          const { gameId } = await this._createGameUseCase.execute(senderId, recipientId, gameFormat);

          this.rooms.set(gameId, {
            white: senderSocketId,
            black: socket.id,
          });

          const senderSocket = this._io.sockets.sockets.get(senderSocketId);
          if (senderSocket) {
            senderSocket.join(gameId);
            senderSocket.emit("matchFound", {
              gameId,
              role: "WHITE",
            });
            console.log(`[Friend Match] Emitted matchFound to sender ${senderId} (Socket: ${senderSocketId})`);
          } else {
            console.warn(`[Friend Match] Could not find socket for sender ${senderId} even though ID was resolved`);
          }

          socket.join(gameId);
          socket.emit("matchFound", {
            gameId,
            role: "BLACK",
          });

          console.log(`[Friend Match] Emitted matchFound to recipient ${recipientId} (Socket: ${socket.id})`);
          console.log(`[Friend Match] Created game: ${gameId}`);
        } catch (error) {
          console.error("Error accepting friend invite:", error);
        }
      });

      socket.on("reject_friend_invite", ({ senderId }) => {
        const senderSocketId = this.userToSocket.get(senderId);
        if (senderSocketId) {
          this._io.to(senderSocketId).emit("invite_rejected");
        }
      });

      socket.on("send_friend_request", ({ recipientId, senderName }) => {
        const recipientSocketId = this.userToSocket.get(recipientId);
        if (recipientSocketId) {
          this._io.to(recipientSocketId).emit("receive_friend_request", { senderName });
        }
      });

      socket.on("accept_friend_request", ({ requesterId }) => {
        const requesterSocketId = this.userToSocket.get(requesterId);
        if (requesterSocketId) {
          this._io.to(requesterSocketId).emit("friendship_changed");
        }
        // Also fire it back to the acceptor so their FriendList re-fetches
        socket.emit("friendship_changed");
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

          if (opponentSocketId === "bot-socket-placeholder") {
            // Auto-accept rematch for bot
            socket.emit("rematchOffered");
          } else if (opponentSocketId) {
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
            oldGame.getTimeControl(),
            oldGame.getDifficulty(),
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

          // If bot is white, it should move first
          if (newWhitePlayerId === "stockfish-bot") {
            const botGame = await this._gameRepo.findById(newGameId);
            if (botGame) {
              const state = botGame.getGameState();
              const difficulty = botGame.getDifficulty() || 1;
              const skillLevel = Math.min(20, (difficulty - 1) * 4);

              this._stockfishService.getBestMove(state.getHistory(), skillLevel).then(async (bestMove) => {
                const updatedBotGame = await this._makeMoveUseCase.execute(
                  newGameId,
                  { row: bestMove.from.row, col: bestMove.from.column },
                  { row: bestMove.to.row, col: bestMove.to.column },
                  bestMove.promotionType as any,
                );
                await this.finalizeGame(updatedBotGame);
              });
            }
          }

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
            `Broadcasting update for ${gameId}. Status: ${updatedGame.getStatus()}`,
          );

          await this.finalizeGame(updatedGame);

          const state = updatedGame.getGameState();
          const nextTurnColor = state.getTurn();

          const whitePlayerId = updatedGame.getWhitePlayerId();
          const blackPlayerId = updatedGame.getBlackPlayerId();

          const isBotNext =
  (nextTurnColor === "WHITE" && whitePlayerId === "stockfish-bot") ||
  (nextTurnColor === "BLACK" && blackPlayerId === "stockfish-bot");


          if (isBotNext && (state.getStatus() === "ACTIVE" || state.getStatus() === "CHECK")) {
            // Map level 1-6 to skill level 0-20
            const difficulty = updatedGame.getDifficulty() || 1;
            const skillLevel = Math.min(20, (difficulty - 1) * 4); // 0, 4, 8, 12, 16, 20

            // Call stockfish asynchronously
            this._stockfishService.getBestMove(state.getHistory(), skillLevel).then(async (bestMove) => {
              try {
                const botTurnGame = await this._makeMoveUseCase.execute(
                  gameId,
                  { row: bestMove.from.row, col: bestMove.from.column },
                  { row: bestMove.to.row, col: bestMove.to.column },
              bestMove.promotionType as any,
                );

                // Broadcast the bot's move to the user
                await this.finalizeGame(botTurnGame);
              } catch(err) {
                console.error("Bot Move failed:", err);
              }
            });
          }


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
        for (const [userId, sId] of this.userToSocket.entries()) {
          if (sId === socket.id) {
            this.userToSocket.delete(userId);
            break;
          }
        }

        console.log("Socket disconnected", socket.id);
      });
    });
  }
}
