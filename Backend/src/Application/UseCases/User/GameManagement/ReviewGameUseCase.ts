import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { StockfishService } from "../../../../Domain/Chess/Service/StockfishService";
import { IReviewGameUseCase, ReviewMoveAnalysis } from "../../../../Domain/Interface/Usecases/User/GameManagement/IReviewGameUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { InitialBoard } from "../../../../Domain/Chess/InitialBoard";
import { Position } from "../../../../Domain/Chess/Position";
import { Board } from "../../../../Domain/Chess/Entities/Board";
import { Queen } from "../../../../Domain/Chess/Pieces/Queen";
import { Rook } from "../../../../Domain/Chess/Pieces/Rook";
import { Bishop } from "../../../../Domain/Chess/Pieces/Bishop";
import { Knight } from "../../../../Domain/Chess/Pieces/Knight";

export class ReviewGameUseCase implements IReviewGameUseCase {
  constructor(
    private readonly _chessGameRepository: IChessGameRepository,
    private readonly _stockfishService: StockfishService,
    private readonly _userRepository: IBaseRepository<EAuth, string>,
  ) {}

  async execute(gameId: string, userId: string): Promise<ReviewMoveAnalysis[]> {
    const [game, user] = await Promise.all([
      this._chessGameRepository.findById(gameId),
      this._userRepository.findById(userId),
    ]);

    if (!game) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GAME_NOT_FOUND);
    }

    if (!user || !user.premium) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "Premium membership required for advanced game analysis.");
    }

    const gameState = game.getGameState();
    const history = gameState.getHistory();

    // Analyze all positions
    const evaluations = await this._stockfishService.analyzeGame(history, 12);

    const analysis: ReviewMoveAnalysis[] = [];
    const board = InitialBoard.create();

    const getPieceName = (type: string) => {
      const names: Record<string, string> = {
        PAWN: "Pawn",
        ROOK: "Rook",
        KNIGHT: "Knight",
        BISHOP: "Bishop",
        QUEEN: "Queen",
        KING: "King",
      };
      return names[type] || type;
    };

    const formatMoveFriendly = (uci: string, currentBoard: Board) => {
      if (!uci || uci.length < 4 || uci === "(none)") return "";
      const fromAlg = uci.slice(0, 2);
      const toAlg = uci.slice(2, 4);

      const fromCol = fromAlg.charCodeAt(0) - 97;
      const fromRow = 8 - parseInt(fromAlg[1]);

      const piece = currentBoard.getPiece(new Position(fromRow, fromCol));
      const pieceName = piece ? getPieceName(piece.type) : "";

      return `${pieceName ? pieceName + " " : ""}${fromAlg} to ${toAlg}`;
    };

    for (let i = 0; i < history.length; i++) {
      const move = history[i];
      const prevEval = evaluations[i];
      const currentEval = evaluations[i + 1];

      let classification: ReviewMoveAnalysis["classification"] = "GOOD";
      let scoreDiff = 0;

      if (prevEval && currentEval) {
        const oldScore = prevEval.score;
        const newScoreForOpponent = currentEval.score;
        const newScore = -newScoreForOpponent;

        scoreDiff = newScore - oldScore;

        // Special handling for Delivering Mate
        if (currentEval.mate === 0 || (currentEval.mate !== null && currentEval.mate <= 0 && prevEval.mate === null)) {
          // If we delivered mate or made a move that leads to mate from a non-mate position
          if (currentEval.mate === 0) {
             classification = "BEST";
             scoreDiff = 100000; // Force best move
          }
        }

        if (i < 4) {
          classification = "BOOK";
        } else if (scoreDiff <= -300) {
          classification = "BLUNDER";
        } else if (scoreDiff <= -150) {
          classification = "MISTAKE";
        } else if (scoreDiff <= -50) {
          classification = "INACCURACY";
        } else if (scoreDiff >= -10 && scoreDiff <= 10) {
          classification = "BEST";
        } else if (scoreDiff > -50 && scoreDiff < -10) {
          classification = "EXCELLENT";
        }
      }

      let description = "";
      const pieceName = getPieceName(move.pieceType);
      const toCol = move.to.column ?? (move.to as any).col;
      const toRow = move.to.row;
      const toSquare = `${String.fromCharCode(97 + toCol)}${8 - toRow}`;
      const evalDiffStr = (Math.abs(scoreDiff) / 100).toFixed(1);

      const bestMoveFriendly = formatMoveFriendly(prevEval?.bestMove || "", board);
      const bestMoveStr = bestMoveFriendly ? ` Best move was ${bestMoveFriendly}.` : "";

      const variants: Record<string, string[]> = {
        BEST: [
          `The best move! ${pieceName} to ${toSquare} is clinical.`,
          `Spot on. ${pieceName} to ${toSquare} was the engine's top choice.`,
          `Excellent find. ${pieceName} to ${toSquare} maintains the pressure.`,
        ],
        BOOK: [
          `${pieceName} to ${toSquare} follows established opening theory.`,
          `Standard book move: ${pieceName} to ${toSquare}.`,
        ],
        EXCELLENT: [
          `${pieceName} to ${toSquare} is a very strong move.`,
          "Great move! This keeps your position solid.",
        ],
        GOOD: [
          `${pieceName} to ${toSquare} is a solid, developing move.`,
          `A natural move by the ${pieceName}.`,
        ],
        INACCURACY: [
          `A slight inaccuracy. ${pieceName} to ${toSquare} drops the eval by ${evalDiffStr}.${bestMoveStr}`,
          `Not the most precise. You might have preferred ${bestMoveFriendly}.`,
        ],
        MISTAKE: [
          `A mistake that weakens your position by ${evalDiffStr} pawns.${bestMoveStr}`,
          `${pieceName} to ${toSquare} was a bit hasty.${bestMoveStr}`,
        ],
        BLUNDER: [
          `Blunder! You lost significant advantage.${bestMoveStr}`,
          `A major oversight. ${bestMoveFriendly} was much better.`,
        ],
      };

      const possiblePhrases = variants[classification] || ["A standard move."];
      description = possiblePhrases[i % possiblePhrases.length];

      if (currentEval.mate === 0) {
        description = `Checkmate! A clinical finish by the ${pieceName}.`;
      }

      analysis.push({
        evaluation: currentEval,
        classification,
        description,
        move: {
          from: { row: move.from.row, col: move.from.column ?? (move.from as any).col },
          to: { row: move.to.row, col: move.to.column ?? (move.to as any).col },
          piece: move.pieceType,
          color: move.color,
          promotion: (move as any).promotionType ?? undefined,
        },
      });

      // Update local board state for next move analysis
      const fromP = new Position(move.from.row, move.from.column ?? (move.from as any).col);
      const toP = new Position(move.to.row, move.to.column ?? (move.to as any).col);

      const movingPiece = board.getPiece(fromP);
      
      // Handle special moves BEFORE moving the piece
      
      // 1. Castling
      if (movingPiece?.type === "KING" && Math.abs(fromP.column - toP.column) === 2) {
        const isKingSide = toP.column === 6;
        const rookFromCol = isKingSide ? 7 : 0;
        const rookToCol = isKingSide ? 5 : 3;
        board.move(new Position(fromP.row, rookFromCol), new Position(fromP.row, rookToCol));
      }

      // 2. En Passant
      if (movingPiece?.type === "PAWN" && fromP.column !== toP.column && !board.getPiece(toP)) {
        const capturedPawnP = new Position(fromP.row, toP.column);
        board.setPiece(capturedPawnP, null);
      }

      // Perform standard move
      board.move(fromP, toP);

      // 3. Promotion
      if (movingPiece?.type === "PAWN" && (move as any).promotionType) {
        const promoType = (move as any).promotionType;
        const color = move.color;
        let newPiece;
        switch(promoType) {
          case "QUEEN": newPiece = new Queen(color); break;
          case "ROOK": newPiece = new Rook(color); break;
          case "BISHOP": newPiece = new Bishop(color); break;
          case "KNIGHT": newPiece = new Knight(color); break;
        }
        if (newPiece) board.setPiece(toP, newPiece);
      }
    }

    return analysis;
  }
}
