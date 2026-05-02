import { IGetDailyPuzzleUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetDailyPuzzleUseCase";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { UserPuzzleResponseDTO } from "../../../../Domain/DTOs/UserDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

export class GetDailyPuzzleUseCase implements IGetDailyPuzzleUseCase {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly _progressRepository: IUserPuzzleProgressRepository
  ) {}

  async execute(userId?: string): Promise<UserPuzzleResponseDTO> {
    const { puzzles } = await this._puzzleRepository.findAll({ limit: 5000 });
    if (puzzles.length === 0) {
      throw new Error("No puzzles available in the library.");
    }
    const now = new Date();
    const samePuzzleToEveryone = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));    
    const index = samePuzzleToEveryone % puzzles.length;
    const dailyPuzzle = puzzles[index];

    let isSolved = false;
    if (userId && dailyPuzzle.id) {
        const progress = await this._progressRepository.findByUserAndPuzzle(userId, dailyPuzzle.id);
        isSolved = !!progress?.solved;
    }

    return PuzzleMapper.toUserPuzzleResponseDTO(dailyPuzzle, isSolved);
  }
}
