import { GameState } from "../Chess/Game/GameState";
import { BaseEntity } from "./BaseEntity";
import { GameStatus } from "../Chess/Game/GameStatus";
import { GameClock } from "./GameClock";

export class ChessGame extends BaseEntity{
  constructor(
        private readonly _gameState :  GameState,
        private _status: GameStatus = "ACTIVE",
        private clock: GameClock,
        id?: string,
  ){
    super(id);
    // Sync initial status if the DB status is ACTIVE but GameState says otherwise
    if (this._status === "ACTIVE" || this._status === "CHECK") {
      const stateStatus = this._gameState.getStatus();
      if (stateStatus !== "ACTIVE") {
        this._status = stateStatus;
      }
    }
  }

  getGameState(): GameState {
    return this._gameState;
  }

  getStatus(): GameStatus {
    return this._status;
  }

  setStatus(status: GameStatus): void {
    this._status = status;
  }

  statusFromGameState(): void {
    this._status = this._gameState.getStatus();
  }

  /**
   * Updates the clock for an active move.
   */
  updateClock(now: number) {
    if (this._status !== "ACTIVE" && this._status !== "CHECK") {
      return;
    }

    this.clock.applyMove(now);

    const timeoutWinner = this.clock.isTimeout();

    if (timeoutWinner === "WHITE") {
      this._status = "BLACK_TIMEOUT"; // Black's time expired, White win
      this.clock.stop();
    } else if (timeoutWinner === "BLACK") {
      this._status = "WHITE_TIMEOUT"; // White's time expired, Black win
      this.clock.stop();
    }
  }

  /**
   * Passive timeout check (used when no move is being made).
   * Returns true if status changed.
   */
  checkPassiveTimeout(now: number = Date.now()): boolean {
    if (this._status !== "ACTIVE" && this._status !== "CHECK") {
      return false;
    }

    const liveTimes = this.clock.getLiveTimes(now);
    
    if (liveTimes.whiteTime <= 0) {
      this._status = "WHITE_TIMEOUT"; // White's time expired
      this.clock.stop();
      return true;
    }
    
    if (liveTimes.blackTime <= 0) {
      this._status = "BLACK_TIMEOUT"; // Black's time expired
      this.clock.stop();
      return true;
    }

    return false;
  }

  getClock(): GameClock {
    return this.clock;
  }

}
