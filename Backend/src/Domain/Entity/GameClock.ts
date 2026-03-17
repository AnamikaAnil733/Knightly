export class GameClock {
  private running: boolean = true;

  constructor(
    public whiteTime: number,
    public blackTime: number,
    public increment: number,
    public turn: "WHITE" | "BLACK",
    public lastMoveTimestamp: number,
  ) {}

  applyMove(now: number) {
    if (!this.running) return;

    const timeSpent = now - this.lastMoveTimestamp;

    if (this.turn === "WHITE") {
      this.whiteTime -= timeSpent;
      this.whiteTime = Math.max(0, this.whiteTime);

      if (this.whiteTime > 0) {
        this.whiteTime += this.increment;
      }
      this.turn = "BLACK";
    } else {
      this.blackTime -= timeSpent;
      this.blackTime = Math.max(0, this.blackTime);

      if (this.blackTime > 0) {
        this.blackTime += this.increment;
      }
      this.turn = "WHITE";
    }

    this.lastMoveTimestamp = now;
  }

  isTimeout(): "WHITE" | "BLACK" | null {
    if (this.whiteTime <= 0) return "BLACK";
    if (this.blackTime <= 0) return "WHITE";
    return null;
  }

  // returns live times by calculating drift since last move
  getLiveTimes(now: number = Date.now()) {
    if (!this.running) {
      return { whiteTime: this.whiteTime, blackTime: this.blackTime };
    }

    const elapsed = now - this.lastMoveTimestamp;
    let w = this.whiteTime;
    let b = this.blackTime;

    if (this.turn === "WHITE") {
      w = Math.max(0, w - elapsed);
    } else {
      b = Math.max(0, b - elapsed);
    }

    return { whiteTime: w, blackTime: b };
  }

  stop(): void {
    this.running = false;
  }
}
