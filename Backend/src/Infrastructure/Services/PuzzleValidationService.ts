import { Chess } from "chess.js";
import { IPuzzleValidationService } from "Domain/Interface/Service/IPuzzleValidationService";

export class PuzzleValidationService implements IPuzzleValidationService {
  validatePuzzle(
    fen: string,
    moves: string[],
  ): { isValid: boolean; error?: string } {
    const chess = new Chess();

    try {
      chess.load(fen);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Illegal position";
      return { isValid: false, error: `Invalid FEN: ${errorMessage}` };
    }

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      try {
        const result = chess.move(move);
        if (!result) {
          return {
            isValid: false,
            error: `Move ${i + 1} (${move}) is illegal in the current position`,
          };
        }
      } catch (e) {
        return {
          isValid: false,
          error: `Invalid move format at index ${i + 1}: ${move}`,
        };
      }
    }
    return { isValid: true };
  }
}
