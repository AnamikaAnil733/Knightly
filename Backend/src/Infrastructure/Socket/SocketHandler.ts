import {Server,Socket} from "socket.io";
import { IMakeMoveUseCase } from "../../Domain/Interface/usecases/User/gameManagement/IMakeMoveUseCase";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";
import { IMatchmakingUseCase } from "../../Domain/Interface/usecases/User/gameManagement/IMatchmakingUseCase";

export class SocketHandler{

  private rooms = new Map<
    string,
    { white?: string; black?: string }
  >();

  constructor(
        private readonly _io:Server,
        private readonly _makeMoveUseCase:IMakeMoveUseCase,
        private readonly _gameRepo:IChessGameRepository,
        private readonly _matchmakingUseCase: IMatchmakingUseCase,
        private readonly _userRepo: IChessGameRepository,
  ){}

  public initialize(){

    this._io.on("connection",(socket:Socket)=>{

      console.log("socket connected",socket.id);

      socket.on("checkTimeout", async (gameId: string) => {
        try {
          const game = await this._gameRepo.findById(gameId);
          if (!game || (game.getStatus() !== "ACTIVE" && game.getStatus() !== "CHECK")) return;

          if (game.checkPassiveTimeout()) {
            await this._gameRepo.update(game);

            const updatedState = game.getGameState();
            const clock = game.getClock();
            const liveTimes = clock.getLiveTimes();

            this._io.to(gameId).emit("gameUpdated", {
              board: updatedState.getBoard().serialize(),
              turn: updatedState.getTurn(),
              history: updatedState.getHistory().map((move: any) => ({
                from: { row: move.from.row, col: move.from.column },
                to: { row: move.to.row, col: move.to.column },
                piece: move.pieceType,
                color: move.color,
                promotion: move.promotionType ?? undefined,
              })),
              status: game.getStatus(),
              clock: {
                whiteTime: liveTimes.whiteTime,
                blackTime: liveTimes.blackTime,
                increment: clock.increment,
                turn: clock.turn,
              },
            });
          }
        } catch (error) {
          console.error("Timeout check error:", error);
        }
      });

      socket.on("findMatch", async (userId: string) => {
        try {
         
          const user = await this._userRepo.findById(userId) as any;
          if (!user) return;

          const rating = user.getRating ? user.getRating("BLITZ") : (user.rating?.BLITZ || 1200);

          const result = await this._matchmakingUseCase.findMatch({
            userId,
            socketId: socket.id,
            rating,
            joinedAt: Date.now(),
          });

          if (result.type === "WAITING") {
            socket.emit("waiting", {
              queueSize: this._matchmakingUseCase.getQueueSize(),
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

      socket.on("joinGame",(gameId:string)=>{
        socket.join(gameId);

        if(!this.rooms.has(gameId)){
          this.rooms.set(gameId,{});
        }

        const room = this.rooms.get(gameId)!;

        let role:"WHITE"|"BLACK"|"SPECTATOR";

        // Prioritize existing assignment (from matchmaking)
        if (room.white === socket.id) {
          role = "WHITE";
        } else if (room.black === socket.id) {
          role = "BLACK";
        }
        // Otherwise fill empty seats (direct joins)
        else if(!room.white){
          room.white = socket.id;
          role = "WHITE";
        }else if(!room.black){
          room.black = socket.id;
          role = "BLACK";
        }else{
          role = "SPECTATOR";
        }

        socket.emit("roleAssigned",role);

        console.log(`Socket ${socket.id} joined ${gameId} as ${role}`);
      });

      socket.on("move",async ({gameId,from, to, promotionType})=>{
        try{

          const room = this.rooms.get(gameId);
          if(!room)return;

          let playerColor :"WHITE"|"BLACK"|null = null;

          if(room.white === socket.id) playerColor = "WHITE";
          if(room.black === socket.id) playerColor = "BLACK";

          if(!playerColor){
            socket.emit("moveError","Spectators cannot move");
            return;
          }
          const game = await this._gameRepo.findById(gameId);
          if(!game) return;

          const gameState = game.getGameState();


          if(gameState.getTurn() !== playerColor){
            socket.emit("moveError","Not your Turn");
            return;
          }

          await this._makeMoveUseCase.execute(
            gameId,
            from,
            to,
            promotionType,
          );

          const updatedGame = await this._gameRepo.findById(gameId);
          if(!updatedGame) {
            console.error("Game not found after move:", gameId);
            return;
          }

          // Passive timeout check
          if (updatedGame.checkPassiveTimeout()) {
            await this._gameRepo.update(updatedGame);
          }

          const updatedState = updatedGame.getGameState();
          const clock = updatedGame.getClock();
          const liveTimes = clock.getLiveTimes();

          console.log(`Broadcasting update for ${gameId}. Status: ${updatedGame.getStatus()}`);

          this._io.to(gameId).emit("gameUpdated",{
            board:updatedState.getBoard().serialize(),
            turn:updatedState.getTurn(),
            history: updatedState.getHistory().map((move: any) => ({
              from: {
                row: move.from.row,
                col: move.from.column,
              },
              to: {
                row: move.to.row,
                col: move.to.column,
              },
              piece: move.pieceType,
              color: move.color,
              promotion: move.promotionType ?? undefined,
            })),
            status:updatedGame.getStatus(),
            clock: {
              whiteTime: liveTimes.whiteTime,
              blackTime: liveTimes.blackTime,
              increment: clock.increment,
              turn: clock.turn,
            },
          });


        }catch(err){
          console.error("Move processing error:", err);
          socket.emit("moveError", (err as Error).message);
        }
      });
      socket.on("disconnect",()=>{

        this._matchmakingUseCase.removeFromQueue(socket.id);

        for(const [gameId,room] of this.rooms.entries()){
          if(room.white === socket.id){
            room.white = undefined;
          }
          if(room.black === socket.id){
            room.black = undefined;
          }
        }
        console.log("Socket disconnected",socket.id);
      });
    });
  }

}
