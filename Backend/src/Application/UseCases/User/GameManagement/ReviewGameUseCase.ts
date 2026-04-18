import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { StockfishService } from "../../../../Domain/Chess/Service/StockfishService";
import { IReviewGameUseCase, ReviewMoveAnalysis } from "../../../../Domain/Interface/Usecases/User/GameManagement/IReviewGameUseCase";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";

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

    const formatUCI = (uci: string) => {
      if (!uci || uci.length < 4) return uci;
      return `${uci.slice(0, 2)} to ${uci.slice(2, 4)}`;
    };

    for (let i = 0; i < history.length; i++) {
      const move = history[i];

      const prevEval = evaluations[i];
      const currentEval = evaluations[i + 1];

      let classification: ReviewMoveAnalysis["classification"] = "GOOD";
      let scoreDiff = 0;

      if (prevEval && currentEval) {
        const oldScore = prevEval.mate !== null ? prevEval.mate * 10000 : prevEval.score;
        const newScoreForOpponent = currentEval.mate !== null ? currentEval.mate * 10000 : currentEval.score;
        const newScore = -newScoreForOpponent;

        scoreDiff = newScore - oldScore;

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
      const toSquare = `${String.fromCharCode(97 + move.to.column)}${8 - move.to.row}`;
      const evalDiffStr = (Math.abs(scoreDiff) / 100).toFixed(1);
      const bestMoveFriendly = formatUCI(currentEval?.bestMove || "");
      console.log(bestMoveFriendly);
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
          `Blunder! You lost significant advantage (${evalDiffStr} pawns).${bestMoveStr}`,
          `A major oversight. ${bestMoveFriendly} was much better.`,
        ],
      };

      const possiblePhrases = variants[classification] || ["A standard move."];
      description = possiblePhrases[i % possiblePhrases.length];

      analysis.push({
        evaluation: currentEval,
        classification,
        description,
        move: {
          from: { row: move.from.row, col: move.from.column },
          to: { row: move.to.row, col: move.to.column },
          piece: move.pieceType,
          color: move.color,
          promotion: (move as any).promotionType ?? undefined,
        },
      });
    }

    return analysis;
  }
}
