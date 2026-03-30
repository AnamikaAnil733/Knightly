import { PuzzleResponseDTO } from "../../../../DTOs/AdminDTOs";

export interface ISyncLichessDailyPuzzleUseCase {
  execute(): Promise<PuzzleResponseDTO>;
}
