import { spawn, ChildProcess } from "child_process";
import path from "path";
import { Position } from "../Position";

// Resolve stockfish binary: prefer system binary (Docker via STOCKFISH_PATH),
// fall back to the npm package binary for local dev.
// spawn() does NOT inherit npm's augmented PATH, so we resolve explicitly.
function resolveStockfishBin(): string {
  if (process.env.STOCKFISH_PATH) return process.env.STOCKFISH_PATH;
  return path.join(__dirname, "../../../../node_modules/.bin/stockfish");
}

const STOCKFISH_BIN = resolveStockfishBin();
const MOVE_TIMEOUT_MS = 10_000;

export class StockfishService {
  constructor() {
    // No longer starting a persistent engine process here
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private positionToAlgebraic(row: number, col: number): string {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  }

  public algebraicToPosition(algebraic: string): { from: Position; to: Position; promotionType?: string } {
    const fromfile = algebraic.charCodeAt(0) - 97;
    const fromrank = 8 - parseInt(algebraic[1]);
    const tofile = algebraic.charCodeAt(2) - 97;
    const torank = 8 - parseInt(algebraic[3]);

    let promotionType: string | undefined;
    if (algebraic.length > 4) {
      const promoChar = algebraic[4];
      if (promoChar === "q") promotionType = "QUEEN";
      if (promoChar === "r") promotionType = "ROOK";
      if (promoChar === "b") promotionType = "BISHOP";
      if (promoChar === "n") promotionType = "KNIGHT";
    }

    return {
      from: new Position(fromrank, fromfile),
      to: new Position(torank, tofile),
      promotionType,
    };
  }

  private historyToUciMoves(history: any[]): string {
    return history
      .map((move) => {
        const fromAlg = this.positionToAlgebraic(move.from.row, move.from.column ?? move.from.col);
        const toAlg = this.positionToAlgebraic(move.to.row, move.to.column ?? move.to.col);
        let promoAlg = "";
        if (move.promotionType) {
          const map: any = { QUEEN: "q", ROOK: "r", BISHOP: "b", KNIGHT: "n" };
          promoAlg = map[move.promotionType] || "q";
        }
        return `${fromAlg}${toAlg}${promoAlg}`;
      })
      .join(" ");
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  public async getBestMove(
    history: any[],
    skillLevel: number = 10,
  ): Promise<{ from: any; to: any; promotionType?: string } | null> {
    const proc = spawn(STOCKFISH_BIN);
    const uciMoves = this.historyToUciMoves(history);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        proc.stdout?.removeListener("data", listener);
        proc.kill();
        reject(new Error("[Stockfish] getBestMove timed out after 10s"));
      }, MOVE_TIMEOUT_MS);

      const listener = (data: Buffer) => {
        const output = data.toString();
        const lines = output.split("\n");

        for (const line of lines) {
          const match = line.match(/bestmove\s([a-h][1-8][a-h][1-8][qrbn]?|\(none\))/);
          if (match) {
            clearTimeout(timeoutId);
            proc.stdout?.removeListener("data", listener);
            const bestMoveAlg = match[1];
            console.log(`[Stockfish] bestmove output: ${bestMoveAlg}`);

            proc.stdin?.write("quit\n");
            proc.kill();

            if (bestMoveAlg === "(none)") {
              resolve(null); // Game is over
            } else {
              resolve(this.algebraicToPosition(bestMoveAlg));
            }
            return;
          }
        }
      };

      proc.stdout!.on("data", listener);

      proc.stdin!.write("uci\n");
      proc.stdin!.write("isready\n");
      proc.stdin!.write("ucinewgame\n");
      proc.stdin!.write(`setoption name Skill Level value ${skillLevel}\n`);

      if (uciMoves.length > 0) {
        proc.stdin!.write(`position startpos moves ${uciMoves}\n`);
      } else {
        proc.stdin!.write("position startpos\n");
      }

      proc.stdin!.write("go depth 10\n");
    });
  }

  public analyzeGame(history: any[], depth: number = 10): Promise<any[]> {

    return new Promise(async (resolve, reject) => {
      const analyzerProcess = spawn(STOCKFISH_BIN);

      analyzerProcess.on("error", (err) => {
        reject(new Error(`[Stockfish] analyzeGame failed to start: ${err.message}`));
      });

      const evaluations: any[] = [];
      const uciMoves: string[] = [];

      const evaluatePosition = (
        movesStr: string,
      ): Promise<{ score: number; mate: number | null; bestMove: string }> =>
        new Promise((res, rej) => {
          let currentScore = 0;
          let currentMate: number | null = null;

          const timeoutId = setTimeout(() => {
            analyzerProcess.stdout?.removeListener("data", listener);
            rej(new Error(`[Stockfish] Analysis timeout for: ${movesStr}`));
          }, 15000);

          const listener = (data: Buffer) => {
            const lines = data.toString().split("\n");
            for (const line of lines) {
              const scoreMatch = line.match(/score cp (-?\d+)/);
              if (scoreMatch) { currentScore = parseInt(scoreMatch[1]); currentMate = null; }

              const mateMatch = line.match(/score mate (-?\d+)/);
              if (mateMatch) {
                currentMate = parseInt(mateMatch[1]);
                if (currentMate > 0) currentScore = 100000 - currentMate;
                else if (currentMate < 0) currentScore = -100000 - currentMate;
                else currentScore = -100001;
              }

              const bestMoveMatch = line.match(/bestmove\s([a-h][1-8][a-h][1-8][qrbn]?|\(none\))/);
              if (bestMoveMatch) {
                clearTimeout(timeoutId);
                analyzerProcess.stdout?.removeListener("data", listener);
                res({ score: currentScore, mate: currentMate, bestMove: bestMoveMatch[1] });
                return;
              }
            }
          };

          analyzerProcess.stdout?.on("data", listener);
          if (movesStr.length > 0) {
            analyzerProcess.stdin?.write(`position startpos moves ${movesStr}\n`);
          } else {
            analyzerProcess.stdin?.write("position startpos\n");
          }
          analyzerProcess.stdin?.write(`go depth ${depth}\n`);
        });

      const waitForReady = () =>
        new Promise<void>((res, rej) => {
          const timeout = setTimeout(() => rej(new Error("[Stockfish] analyzeGame ready timeout")), 10000);
          const listener = (data: Buffer) => {
            if (data.toString().includes("readyok")) {
              clearTimeout(timeout);
              analyzerProcess.stdout?.removeListener("data", listener);
              res();
            }
          };
          analyzerProcess.stdout?.on("data", listener);
          analyzerProcess.stdin?.write("uci\n");
          analyzerProcess.stdin?.write("isready\n");
        });

      try {
        await waitForReady();

        const startEval = await evaluatePosition("");
        evaluations.push(startEval);

        for (const move of history) {
          const fromAlg = this.positionToAlgebraic(move.from.row, move.from.column ?? move.from.col);
          const toAlg = this.positionToAlgebraic(move.to.row, move.to.column ?? move.to.col);
          let promoAlg = "";
          if (move.promotionType) {
            const map: any = { QUEEN: "q", ROOK: "r", BISHOP: "b", KNIGHT: "n" };
            promoAlg = map[move.promotionType] || "q";
          }
          uciMoves.push(`${fromAlg}${toAlg}${promoAlg}`);
          const positionEval = await evaluatePosition(uciMoves.join(" "));
          evaluations.push(positionEval);
        }

        analyzerProcess.stdin?.write("quit\n");
        resolve(evaluations);
      } catch (err) {
        analyzerProcess.stdin?.write("quit\n");
        reject(err);
      }
    });
  }
}
