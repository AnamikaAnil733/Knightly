import { UserPuzzleResponseDTO } from "../../../../DTOs/UserDTOs";
import { PuzzleType } from "../../../../Types/PuzzleTypes";

export interface IGetPuzzleByDifficulty {
  execute(
    userId: string,
    difficulty: PuzzleType
  ): Promise<UserPuzzleResponseDTO>;
}
