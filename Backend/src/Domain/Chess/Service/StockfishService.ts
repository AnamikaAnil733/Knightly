import {spawn,ChildProcess} from "child_process";

import { Position } from "../Position";

export class StockfishService{
  private engineProcess:ChildProcess;
  private isReady:boolean = false;

  constructor(){
    this.engineProcess = spawn("stockfish");


    this.engineProcess.stdout?.on("data",(data)=>{
      const output = data.toString();
      if(output.includes("readyok")){
        this.isReady = true;
      }
    });
    this.engineProcess.stdin?.write("uci\n");
    this.engineProcess.stdin?.write("isready\n");
  }

  private positionToAlgebraic(row:number,col:number):string{
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  }

  public algebraicToPosition(algebraic:string):{from:Position,to:Position,promotionType?:string}{
    const fromfile = algebraic.charCodeAt(0) - 97;
    const fromrank = 8- parseInt(algebraic[1]);
    const tofile = algebraic.charCodeAt(2) - 97;
    const torank = 8 - parseInt(algebraic[3]);

    let promotionType = undefined;

    if(algebraic.length>4){
      const promoChar = algebraic[4];
      if(promoChar === "q") promotionType = "QUEEN";
      if(promoChar === "r") promotionType = "ROOK";
      if(promoChar === "b") promotionType = "BISHOP";
      if(promoChar === "n") promotionType = "KNIGHT";

    }
    return {
      from:new Position(fromrank,fromfile),
      to:new Position(torank,tofile),
      promotionType,
    };

  }


  public getBestMove(history: any[], skillLevel: number = 10): Promise<{from: any, to: any, promotionType?: string}> {
    return new Promise((resolve) => {
      //Format the history into UCI moves string
      const uciMoves = history.map(move => {
        const fromAlg = this.positionToAlgebraic(move.from.row, move.from.column ?? move.from.col);
        const toAlg = this.positionToAlgebraic(move.to.row, move.to.column ?? move.to.col);
        let promoAlg = "";
        if (move.promotionType) {
          const map: any = { "QUEEN": "q", "ROOK": "r", "BISHOP": "b", "KNIGHT": "n" };
          promoAlg = map[move.promotionType] || "q";
        }
        return `${fromAlg}${toAlg}${promoAlg}`;
      }).join(" ");

      // Request best move
      const listener = (data: Buffer) => {
        const output = data.toString();
        // Match standard bestmove and (none) for game over/stalemate
        const match = output.match(/bestmove\s([a-h1-8qrbn]{4,5}|\(none\))/);
        if (match) {
          console.log(`Stockfish response: ${output.trim()}`);
          this.engineProcess.stdout?.removeListener("data", listener); // Stop listening once we get it
          const bestMoveAlg = match[1];
          if (bestMoveAlg === "(none)") {
            resolve({ from: new Position(0,0), to: new Position(0,0) }); // Placeholder for game over
          } else {
            resolve(this.algebraicToPosition(bestMoveAlg));
          }
        }
      };
      this.engineProcess.stdout?.on("data", listener);

      // Set difficulty
      this.engineProcess.stdin?.write(`setoption name Skill Level value ${skillLevel}\n`);

      // Set position
      if (uciMoves.length > 0) {
        this.engineProcess.stdin?.write(`position startpos moves ${uciMoves}\n`);
      } else {
        this.engineProcess.stdin?.write("position startpos\n");
      }

      console.log(`Sending to Stockfish: position startpos moves ${uciMoves}`);
      this.engineProcess.stdin?.write("go depth 10\n"); // Calculate 10 moves deep
    });
  }

  public analyzeGame(history: any[], depth: number = 10): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const analyzerProcess = spawn("stockfish");

      const evaluations: any[] = [];
      const uciMoves: string[] = [];

      analyzerProcess.stdin?.write("uci\n");
      analyzerProcess.stdin?.write("isready\n");

      const evaluatePosition = (movesStr: string): Promise<{ score: number, mate: number | null, bestMove: string }> => new Promise((res, rej) => {
        let currentScore = 0;
        let currentMate: number | null = null;

        const timeoutId = setTimeout(() => {
          analyzerProcess.stdout?.removeListener("data", listener);
          rej(new Error(`Stockfish analysis timeout for moves: ${movesStr}`));
        }, 15000);

        const listener = (data: Buffer) => {
          const output = data.toString();
          const lines = output.split("\n");

          for (const line of lines) {
            const scoreMatch = line.match(/score cp (-?\d+)/);
            if (scoreMatch) {
              currentScore = parseInt(scoreMatch[1]);
              currentMate = null;
            }

            const mateMatch = line.match(/score mate (-?\d+)/);
            if (mateMatch) {
              currentMate = parseInt(mateMatch[1]);
              if (currentMate > 0) {
                currentScore = 100000 - currentMate;
              } else if (currentMate < 0) {
                currentScore = -100000 - currentMate;
              } else {
                // currentMate === 0 means already checkmate
                currentScore = -100001; // The side to move is already mated
              }
            }

            const bestMoveMatch = line.match(/bestmove\s([a-h1-8qrbn]{4,5}|\(none\))/);
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

      // Initialization helper
      const waitForReady = () => new Promise<void>((res, rej) => {
        const timeout = setTimeout(() => rej(new Error("Stockfish ready timeout")), 10000);
        const listener = (data: Buffer) => {
          if (data.toString().includes("readyok")) {
            clearTimeout(timeout);
            analyzerProcess.stdout?.removeListener("data", listener);
            res();
          }
        };
        analyzerProcess.stdout?.on("data", listener);
        analyzerProcess.stdin?.write("isready\n");
      });

      try {
        analyzerProcess.stdin?.write("uci\n");
        // No need to wait for uciok, just isready -> readyok is enough for initialization
        await waitForReady();

        const startEval = await evaluatePosition("");
        evaluations.push(startEval);

        for (const move of history) {
          const fromAlg = this.positionToAlgebraic(move.from.row, move.from.column ?? move.from.col);
          const toAlg = this.positionToAlgebraic(move.to.row, move.to.column ?? move.to.col);
          let promoAlg = "";
          if (move.promotionType) {
            const map: any = { "QUEEN": "q", "ROOK": "r", "BISHOP": "b", "KNIGHT": "n" };
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
