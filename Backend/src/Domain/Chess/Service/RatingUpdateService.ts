
import { ChessGame } from "../../Entity/ChessGame";
import { EloCalculator } from "./EloRatingCalculator";
import EAuth from "../../Entity/Auth";
import { IUserRepository } from "../../Interface/Repositories/IUserRepository";

export type TimeControl = "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL";

export class RatingUpdateService {
  constructor(private readonly _userRepo: IUserRepository) {}

  public async updateRatings(game: ChessGame): Promise<{ 
    whiteNew: number; 
    blackNew: number;
    whiteDelta: number;
    blackDelta: number;
  } | null> {
    const status = game.getStatus();
    if (status === "ACTIVE" || status === "CHECK") return null;
    if (game.isRatingUpdated()) {
      console.log(`Rating already updated for game ${game.id}`);
      return null;
    }

    const whiteId = game.getWhitePlayerId();
    const blackId = game.getBlackPlayerId();

    console.log(`Finalizing game ${game.id}. White: ${whiteId}, Black: ${blackId}, Status: ${status}`);

    if (!whiteId || !blackId) {
      console.warn("Missing player IDs, cannot update ratings");
      return null;
    }

    // Skip rating updates for bot games
    if (whiteId === "stockfish-bot" || blackId === "stockfish-bot") {
      console.log("Bot game detected, skipping rating update.");
      return null;
    }

    const whitePlayer = await this._userRepo.findById(whiteId);
    const blackPlayer = await this._userRepo.findById(blackId);

    if (!whitePlayer || !blackPlayer) {
      console.warn(`Could not find players in DB: White found: ${!!whitePlayer}, Black found: ${!!blackPlayer}`);
      return null;
    }

    const gameType = this.categorizeTimeControl(game.getTimeControl());
    const whiteRating = whitePlayer.getRating(gameType);
    const blackRating = blackPlayer.getRating(gameType);

    const score = this.getScore(game);
    
    // Calculate new ratings
    const { newA: newWhite, newB: newBlack } = EloCalculator.calculateNewRating(
      whiteRating,
      blackRating,
      score
    );

    // Update ratings in entities
    whitePlayer.updateRating(gameType, newWhite);
    blackPlayer.updateRating(gameType, newBlack);

    console.log(`Updating ${gameType} ratings: White ${whiteRating}->${newWhite}, Black ${blackRating}->${newBlack}`);

    // Update games played/win stats
    this.updateStats(whitePlayer, blackPlayer, score);

    // Persist changes
    const [u1, u2] = await Promise.all([
      this._userRepo.update(whitePlayer),
      this._userRepo.update(blackPlayer),
    ]);

    if (!u1 || !u2) {
      console.error(`Failed to persist rating updates in DB for ${game.id}`);
    }

    game.setRatingUpdated();
    
    return {
       whiteNew: newWhite,
       blackNew: newBlack,
       whiteDelta: newWhite - whiteRating,
       blackDelta: newBlack - blackRating
    };
  }

  private categorizeTimeControl(timeControl: string): TimeControl {
    const parts = timeControl.split("+");
    const minutes = parseInt(parts[0]);

    if (minutes < 3) return "BULLET";
    if (minutes < 10) return "BLITZ";
    if (minutes < 30) return "RAPID";
    return "CLASSICAL";
  }

  private getScore(game: ChessGame): 0 | 0.5 | 1 {
    const status = game.getStatus();

    if (status === "BLACK_TIMEOUT" || status === "BLACK_RESIGNED") return 1;
    if (status === "WHITE_TIMEOUT" || status === "WHITE_RESIGNED") return 0;

    if (
      status === "STALEMATE" ||
      status === "DRAW_BY_REPETITION" ||
      status === "DRAW_BY_FIFTY_MOVES" ||
      status === "DRAW_BY_INSUFFICIENT_MATERIAL" ||
      status === "DRAW_BY_AGREEMENT"
    ) {
      return 0.5;
    }

    if (status === "CHECKMATE") {
      // If result is checkmate, the player WHOSE TURN IT WAS lost.
      return game.getGameState().getTurn() === "BLACK" ? 1 : 0;
    }

    return 0.5;
  }

  private updateStats(white: EAuth, black: EAuth, score: number): void {
    if (score === 1) {
      white.addWin();
      black.addLoss();
    } else if (score === 0) {
      white.addLoss();
      black.addWin();
    } else {
      white.addDraw();
      black.addDraw();
    }
  }
}
