import {Server,Socket} from "socket.io";
import { IMakeMoveUseCase } from "../../Domain/Interface/usecases/user/gameManagement/IMakeMoveUseCase";
import { IChessGameRepository } from "../../Domain/Interface/Repositories/IGameRepository";

export class SocketHandler{

    private rooms = new Map<
    string,
    { white?: string; black?: string }
  >();

    constructor(
        private readonly _io:Server,
        private readonly _makeMoveUseCase:IMakeMoveUseCase,
        private readonly _gameRepo:IChessGameRepository,
    ){}

public initialize(){
    
    this._io.on("connection",(socket:Socket)=>{
        console.log("socket connected",socket.id)
        socket.on("joinGame",(gameId:string)=>{
            socket.join(gameId);
        
            if(!this.rooms.has(gameId)){
                this.rooms.set(gameId,{})
            }

            const room = this.rooms.get(gameId)!;

            let role:"WHITE"|"BLACK"|"SPECTATOR";

            if(!room.white){
                room.white = socket.id;
                role = "WHITE"
            }else if(!room.black){
                room.black = socket.id;
                role = "BLACK"
            }else{
                role = "SPECTATOR"
            }

            socket.emit("roleAssigned",role);

            console.log("joined",gameId);
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
                socket.emit("moveError","Not your Turn")
                return
              }

                await this._makeMoveUseCase.execute(
                    gameId,
                    from,
                    to,
                    promotionType,
                );

                const updatedGame = await this._gameRepo.findById(gameId)
                if(!updatedGame) return;

                const updatedState = updatedGame.getGameState()

                this._io.to(gameId).emit("gameUpdated",{
                    board:updatedState.getBoard().serialize(),
                    turn:updatedState.getTurn(),
                    history:updatedState.getHistory(),
                    status:updatedState.getStatus(),
                })

            }catch{
                socket.emit("moveError");
            }
        })
        socket.on("disconnect",()=>{
            for(const [gameId,room] of this.rooms.entries()){
                if(room.white === socket.id){
                    room.white = undefined
                }
                if(room.black === socket.id){
                    room.black = undefined
                }
            }

                console.log("Socket disconnected",socket.id)
            })
    })
}

}