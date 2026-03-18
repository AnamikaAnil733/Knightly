import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { StockfishService } from "../../../../Domain/Chess/Service/StockfishService";
import { IReviewGameUseCase, ReviewMoveAnalysis } from "../../../../Domain/Interface/Usecases/User/GameManagement/IReviewGameUseCase";

export class ReviewGameUseCase implements IReviewGameUseCase {
  constructor(
    private readonly _chessGameRepository: IChessGameRepository,
    private readonly _stockfishService: StockfishService,
  ) {}

  async execute(gameId: string): Promise<ReviewMoveAnalysis[]> {
    const game = await this._chessGameRepository.findById(gameId);

    if (!game) {
      throw new Error(MESSAGES.GAME_NOT_FOUND);
    }

    const gameState = game.getGameState();
    const history = gameState.getHistory();

    // Analyze all positions
    const evaluations = await this._stockfishService.analyzeGame(history, 12);

    const analysis: ReviewMoveAnalysis[] = [];

   for (let i = 0; i < history.length; i++) {
      const move = history[i];

      const prevEval = evaluations[i];
      const currentEval = evaluations[i + 1];

      let classification: ReviewMoveAnalysis["classification"] = "GOOD";

      if (prevEval && currentEval) {

        const oldScore = prevEval.mate !== null ? prevEval.mate * 10000 : prevEval.score;
        const newScoreForOpponent = currentEval.mate !== null ? currentEval.mate * 10000 : currentEval.score;
        const newScore = -newScoreForOpponent;

        const diff = newScore - oldScore; 

        if (i < 4) {
          classification = "BOOK"; // Very basic opening book approximation
        } else if (diff <= -300) {
          classification = "BLUNDER";
        } else if (diff <= -150) {
          classification = "MISTAKE";
        } else if (diff <= -50) {
          classification = "INACCURACY";
        } else if (diff >= -10 && diff <= 10) {
          classification = "BEST";
        } else if (diff > -50 && diff < -10) {
          classification = "EXCELLENT";
        }
      }

      analysis.push({
        evaluation: currentEval,
        classification,
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
