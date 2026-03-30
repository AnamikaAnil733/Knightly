import { IPuzzleGeneratorService } from "../../Domain/Interface/Service/IPuzzleGeneratorService";
import { StockfishService } from "../../Domain/Chess/Service/StockfishService";
import { EPuzzle } from "../../Domain/Entity/Puzzle";
import { PuzzleType } from "../../Domain/Types/PuzzleTypes";
import axios from "axios";
import { Chess } from "chess.js";
import { GameState } from "../../Domain/Chess/Game/GameState";
import { InitialBoard } from "../../Domain/Chess/InitialBoard";
import { Position } from "../../Domain/Chess/Position";
import { PromotionType } from "../../Domain/Chess/Game/PromotionType";

export class PuzzleGeneratorService implements IPuzzleGeneratorService {
  constructor(private readonly _stockfishService: StockfishService) {}

  async generateFromGame(history: any[]): Promise<EPuzzle[]> {
    const evaluations = await this._stockfishService.analyzeGame(history, 10);
    const puzzles: EPuzzle[] = [];

    // Use native logic to simulate the game - perfectly synced with Knightly data
    const board = InitialBoard.create();
    const gameState = new GameState(board);

    for (let i = 0; i < history.length; i++) {
      const move = history[i];
      const prevFen = this.gameStateToFEN(gameState);

      try {
        // Map plain objects to Position entities if needed
        const fromP = new Position(move.from.row, move.from.column !== undefined ? move.from.column : (move.from as any).col);
        const toP = new Position(move.to.row, move.to.column !== undefined ? move.to.column : (move.to as any).col);

        // promotionType mapping
        const promo: PromotionType | undefined = move.promotionType;
        if (!promo && move.pieceType && move.pieceType.length > 1 && move.pieceType !== "PAWN") {
          // If pieceType is QUEEN but it was a pawn move, it's a promotion
          // But Knightly history usually stores the explicit promotionType if any.
        }

        gameState.makeMove(fromP, toP, promo);
      } catch (err: any) {
        console.error(`Move execution error in game analysis: ${err.message}`);
        continue;
      }

      const prevEval = evaluations[i];
      const currentEval = evaluations[i + 1];

      if (prevEval && currentEval) {
        const oldScore = prevEval.mate !== null ? prevEval.mate * 10000 : prevEval.score;
        const newScoreRaw = currentEval.mate !== null ? currentEval.mate * 10000 : currentEval.score;
        const newScore = -newScoreRaw; // Invert to compare from same perspective

        const diff = newScore - oldScore;

        if (diff <= -300 && currentEval.bestMove && currentEval.bestMove !== "(none)") {
          // The puzzle starts AFTER the blunder.
          // The user must find the "punishment" move suggested by Stockfish.
          const postFen = this.gameStateToFEN(gameState);
          const sanMove = this.formatUCIToSAN(postFen, currentEval.bestMove);

          puzzles.push(new EPuzzle({
            fen: postFen,
            moves: [sanMove],
            difficulty: PuzzleType.MEDIUM,
            description: "Punish the blunder!",
          }));
        }
      }
    }
    return puzzles;
  }

  private gameStateToFEN(state: GameState): string {
    const board = state.getBoard();
    const serialized = board.serialize();
    const fenChunks: string[] = [];

    for (let i = 0; i < 8; i++) {
      let row = "";
      let empty = 0;
      for (let j = 0; j < 8; j++) {
        const cell = serialized[i][j];
        if (!cell) {
          empty++;
        } else {
          if (empty > 0) {
            row += empty;
            empty = 0;
          }
          const typeMap: Record<string, string> = {
            "PAWN": "p", "ROOK": "r", "KNIGHT": "n", "BISHOP": "b", "QUEEN": "q", "KING": "k",
          };
          const char = typeMap[cell.type] || "p";
          row += cell.color === "WHITE" ? char.toUpperCase() : char.toLowerCase();
        }
      }
      if (empty > 0) row += empty;
      fenChunks.push(row);
    }

    let fen = fenChunks.join("/");

    // Turn
    const turn = state.getTurn() === "WHITE" ? "w" : "b";
    fen += ` ${turn}`;

    // Castling rights
    let castling = "";
    // White
    const wk = serialized[7][4];
    if (wk && wk.type === "KING" && !wk.hasMoved) {
      const wrh = serialized[7][7];
      if (wrh && wrh.type === "ROOK" && !wrh.hasMoved) castling += "K";
      const wra = serialized[7][0];
      if (wra && wra.type === "ROOK" && !wra.hasMoved) castling += "Q";
    }
    // Black
    const bk = serialized[0][4];
    if (bk && bk.type === "KING" && !bk.hasMoved) {
      const brh = serialized[0][7];
      if (brh && brh.type === "ROOK" && !brh.hasMoved) castling += "k";
      const bra = serialized[0][0];
      if (bra && bra.type === "ROOK" && !bra.hasMoved) castling += "q";
    }
    fen += ` ${castling || "-"}`;

    // En Passant target
    const ep = board.getEnPassantTarget();
    if (ep) {
      fen += ` ${this.colRowToAlgebraic(ep.row, ep.column)}`;
    } else {
      fen += " -";
    }

    // Halfmove clock and fullmove number (simplified/default for puzzles)
    fen += " 0 1";

    return fen;
  }

  private colRowToAlgebraic(row: number, col: number): string {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
  }

  private formatUCIToSAN(fen: string, uci: string): string {
    try {
      const chess = new Chess(fen);
      const move = chess.move({
        from: uci.slice(0, 2),
        to: uci.slice(2, 4),
        promotion: uci.length > 4 ? uci[4] : undefined,
      });
      return move ? move.san : uci;
    } catch {
      return uci;
    }
  }

  private convertUCIListToSAN(startFen: string, uciMoves: string[]): string[] {
    try {
      const chess = new Chess(startFen);
      const sanMoves: string[] = [];
      for (const uci of uciMoves) {
        const move = chess.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci.length > 4 ? uci[4] : undefined,
        });
        if (move) {
          sanMoves.push(move.san);
        } else {
          sanMoves.push(uci);
        }
      }
      return sanMoves;
    } catch {
      return uciMoves;
    }
  }

  private getFENFromPGN(pgn: string, ply: number): string {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      const history = chess.history();
      chess.reset();
      for (let i = 0; i < ply; i++) {
        if (history[i]) {
          chess.move(history[i]);
        }
      }
      return chess.fen();
    } catch (err) {
      console.error("Failed to reconstruct FEN from PGN", err);
      return "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
  }

  async fetchLichessDaily(): Promise<EPuzzle> {
    try {
      const response = await axios.get("https://lichess.org/api/puzzle/daily", {
        headers: {
          "User-Agent": "Knightly-Chess-App (https://github.com/AnamikaAnil733/Knightly)",
        },
      });
      const data = response.data as any;

      if (!data?.puzzle?.solution || !data?.game?.pgn) {
        throw new Error("Malformed response from Lichess API (missing solution or PGN)");
      }

      // Reconstruct the FEN from PGN and initialPly + 1 (plays through the setup blunder)
      const initialPly = data.puzzle.initialPly || 0;
      const fen = this.getFENFromPGN(data.game.pgn, initialPly + 1);

      const uciSolution = data.puzzle.solution as string[];
      const puzzleMoves = this.convertUCIListToSAN(fen, uciSolution);

      return new EPuzzle({
        fen,
        moves: puzzleMoves,
        difficulty: PuzzleType.HARD,
        description: `Lichess Daily Puzzle. Theme: ${data.puzzle.themes?.join(", ") || "Tactics"}`,
      });
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.error(`Lichess Sync Error [${status}]: ${message}`);
      throw new Error(`Lichess Sync Failed: ${message}`);
    }
  }
}
