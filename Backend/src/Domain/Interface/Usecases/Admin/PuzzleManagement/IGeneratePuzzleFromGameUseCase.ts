import { PuzzleResponseDTO } from "../../../../DTOs/AdminDTOs";

export interface IGeneratePuzzleFromGameUseCase {
  execute(gameId?: string): Promise<PuzzleResponseDTO[]>;
}
