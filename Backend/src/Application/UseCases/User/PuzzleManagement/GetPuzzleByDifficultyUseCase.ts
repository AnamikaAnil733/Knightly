import { IGetPuzzleByDifficulty } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleByDifficultyUseCase";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { UserPuzzleResponseDTO } from "../../../../Domain/DTOs/UserDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

export class GetPuzzleDifficultyUsecase implements IGetPuzzleByDifficulty {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly _progressRepository: IUserPuzzleProgressRepository,
    private readonly _userRepository: IBaseRepository<EAuth, string>,
  ) {}

  async execute(userId: string, difficulty: PuzzleType): Promise<UserPuzzleResponseDTO> {
    if (!userId) throw new Error("userId is Required");
    if (!difficulty) throw new Error("difficulty is required");

    // Check Premium Status and Daily Limit
    const user = await this._userRepository.findById(userId);
    if (!user || !user.premium) {
      const solvedToday = await this._progressRepository.countSolvedToday(userId);
      if (solvedToday >= 5) {
        throw new Error("Daily puzzle limit reached for free account. Upgrade to Premium for unlimited puzzles!");
      }
    }

    const puzzle = await this._puzzleRepository.getPuzzleByDifficulty(userId, difficulty);
    if (!puzzle) throw new Error("all puzzles are completed");

    let isSolved = false;
    if (userId && puzzle.id) {
        const progress = await this._progressRepository.findByUserAndPuzzle(userId, puzzle.id);
        isSolved = !!progress?.solved;
    }

    return PuzzleMapper.toUserPuzzleResponseDTO(puzzle, isSolved);
  }
}
