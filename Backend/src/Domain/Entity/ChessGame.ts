import { GameState } from "../Chess/Game/GameState";
import { BaseEntity } from "./BaseEntity";
import { GameStatus } from "../Chess/Game/GameStatus";
import { GameClock } from "./GameClock";

export class ChessGame extends BaseEntity {
  constructor(
    private readonly _gameState: GameState,
    private _status: GameStatus = "ACTIVE",
    private clock: GameClock,
    private _whitePlayerId?: string,
    private _blackPlayerId?: string,
    private readonly _timeControl: string = "5+0",
    id?: string,
    private _isRatingUpdated: boolean = false,
    private _whiteRatingChange?: number,
    private _blackRatingChange?: number,
    private _difficulty?: number,
    createdAt?: Date,
  ) {
    super(id, createdAt);
    if (this._status === "ACTIVE" || this._status === "CHECK") {
      const stateStatus = this._gameState.getStatus();
      if (stateStatus !== "ACTIVE" && stateStatus !== "CHECK") {
        this._status = stateStatus;
        this.clock.stop();
      } else {
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
    if (this._status !== "ACTIVE" && this._status !== "CHECK") {
      this.clock.stop();
    }
  }

  updateClock(now: number) {
    if (this._status !== "ACTIVE" && this._status !== "CHECK") {
      return;
    }

    this.clock.applyMove(now);

    const timeoutWinner = this.clock.isTimeout();

    if (timeoutWinner === "WHITE") {
      this._status = "BLACK_TIMEOUT";
      this.clock.sync(now);
    } else if (timeoutWinner === "BLACK") {
      this._status = "WHITE_TIMEOUT";
      this.clock.sync(now);
    }
  }

  checkPassiveTimeout(now: number = Date.now()): boolean {
    if (this._status !== "ACTIVE" && this._status !== "CHECK") {
      return false;
    }

    const liveTimes = this.clock.getLiveTimes(now);

    if (liveTimes.whiteTime <= 0) {
      this._status = "WHITE_TIMEOUT";
      this.clock.sync(now);
      return true;
    }

    if (liveTimes.blackTime <= 0) {
      this._status = "BLACK_TIMEOUT";
      this.clock.sync(now);
      return true;
    }

    return false;
  }

  getClock(): GameClock {
    return this.clock;
  }

  getWhitePlayerId(): string | undefined {
    return this._whitePlayerId;
  }

  getBlackPlayerId(): string | undefined {
    return this._blackPlayerId;
  }

  getTimeControl(): string {
    return this._timeControl;
  }

  isRatingUpdated(): boolean {
    return this._isRatingUpdated;
  }

  setRatingUpdated(): void {
    this._isRatingUpdated = true;
  }

  getDifficulty(): number | undefined {
    return this._difficulty;
  }

  getWhiteRatingChange(): number | undefined {
    return this._whiteRatingChange;
  }

  setWhiteRatingChange(change: number): void {
    this._whiteRatingChange = change;
  }

  getBlackRatingChange(): number | undefined {
    return this._blackRatingChange;
  }

  setBlackRatingChange(change: number): void {
    this._blackRatingChange = change;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
}
