export interface IPuzzleValidationService {
    validatePuzzle(
      fen: string,
      moves: string[]
    ): { isValid: boolean; error?: string };
  }
