import { IGetPuzzleByDifficulty } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleByDifficultyUseCase";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { UserPuzzleResponseDTO } from "../../../../Domain/DTOs/UserDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

export class GetPuzzleDifficultyUsecase implements IGetPuzzleByDifficulty {
  constructor(private readonly _puzzleRepository: IPuzzleRepository) {}

  async execute(userId: string, difficulty: PuzzleType): Promise<UserPuzzleResponseDTO> {
    if (!userId) throw new Error("userId is Required");
    if (!difficulty) throw new Error("difficulty is required");

    const puzzle = await this._puzzleRepository.getPuzzleByDifficulty(userId, difficulty);
    if (!puzzle) throw new Error("all puzzles are completed");

    return PuzzleMapper.toUserPuzzleResponseDTO(puzzle);
  }
}
