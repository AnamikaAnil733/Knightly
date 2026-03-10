import {spawn,ChildProcess} from 'child_process';
import { Position } from '../Position';

export class StockfishService{
    private engineProcess:ChildProcess;
    private isReady:boolean = false;

    constructor(){
        this.engineProcess = spawn('stockfish');

        this.engineProcess.stdout?.on('data',(data)=>{
            const output = data.toString();
            if(output.includes('readyok')){
                this.isReady = true
            }
        });
        this.engineProcess.stdin?.write("uci\n");
        this.engineProcess.stdin?.write("isready\n")
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
        if(promoChar == 'q') promotionType = "QUEEN";
        if(promoChar == 'r') promotionType = "ROOK";
        if(promoChar == 'b') promotionType = "BISHOP";
        if(promoChar == 'n') promotionType = "KNIGHT";

    }
    return {
        from:new Position(fromrank,fromfile),
        to:new Position(torank,tofile),
        promotionType
    }

}


public getBestMove(history: any[], skillLevel: number = 10): Promise<{from: any, to: any, promotionType?: string}> {
    return new Promise((resolve) => {
      //Format the history into UCI moves string
      const uciMoves = history.map(move => {
        const fromAlg = this.positionToAlgebraic(move.from.row, move.from.column);
        const toAlg = this.positionToAlgebraic(move.to.row, move.to.column);
        let promoAlg = '';
        if (move.promotionType) {
           const map: any = { "QUEEN": "q", "ROOK": "r", "BISHOP": "b", "KNIGHT": "n" };
           promoAlg = map[move.promotionType] || 'q';
        }
        return `${fromAlg}${toAlg}${promoAlg}`;
      }).join(' ');

      // Set difficulty 
      this.engineProcess.stdin?.write(`setoption name Skill Level value ${skillLevel}\n`);
      
      // Set position
      if (uciMoves.length > 0) {
        this.engineProcess.stdin?.write(`position startpos moves ${uciMoves}\n`);
      } else {
        this.engineProcess.stdin?.write(`position startpos\n`);
      }
      
      console.log(`Sending to Stockfish: position startpos moves ${uciMoves}`);
      // Request best move
      this.engineProcess.stdin?.write("go depth 10\n"); // Calculate 10 moves deep
      // Listen for the "bestmove" output
      const listener = (data: Buffer) => {
        const output = data.toString();
        const match = output.match(/bestmove\s([a-h1-8qrbn]{4,5})/);
        if (match) {
          console.log(`Stockfish response: ${output.trim()}`);
          this.engineProcess.stdout?.removeListener('data', listener); // Stop listening once we get it
          const bestMoveAlg = match[1];
          resolve(this.algebraicToPosition(bestMoveAlg));
        }
      };
      this.engineProcess.stdout?.on('data', listener);
    });
  }


}