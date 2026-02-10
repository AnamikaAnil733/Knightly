import { GameState } from "../Chess/Game/GameState";
import { BaseEntity } from "./BaseEntity";
import { GameStatus } from "../Chess/Game/GameStatus";

export class ChessGame extends BaseEntity{
    constructor(
        private readonly _gameState :  GameState,
        private _status:GameStatus = "ACTIVE",
        id?:string,
    ){
        super(id)
    }

    getGameState():GameState{
        return this._gameState;
    }
     
    getStatus():GameStatus{
        return this._status
    }
    setStatus(status:GameStatus):void{
       this._status = status;
    }
    statusFromGameState():void{
        this._status = this._gameState.getStatus()
    }
  
}