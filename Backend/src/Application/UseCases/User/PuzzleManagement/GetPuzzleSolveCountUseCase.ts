import { IGetPuzzleSolveCountUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveCountUseCase";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";

export class GetPuzzleSolveCountUseCase implements IGetPuzzleSolveCountUseCase {
  constructor(
        private readonly _progressRepository: IUserPuzzleProgressRepository,
        private readonly _puzzleRepository: IPuzzleRepository
  ) {}

  async execute(userId: string): Promise<{ today: number; total: number; completedCategories: string[] }> {
    const today = await this._progressRepository.countSolvedToday(userId);
    const solvedPuzzles = await this._progressRepository.getSolvedPuzzles(userId);
    
    // Check for completed categories
    const categories = [PuzzleType.EASY, PuzzleType.MEDIUM, PuzzleType.HARD, PuzzleType.EXPERT];
    const completedCategories: string[] = [];

    for (const category of categories) {
        const unsolvedCount = await this._puzzleRepository.countUnsolvedByCategory(userId, category);
        const totalCount = await this._puzzleRepository.countByCategory(category);
        
        // Only mark as completed if there are AT LEAST some puzzles in this category and they are all solved
        if (totalCount > 0 && unsolvedCount === 0) {
            completedCategories.push(category.toLowerCase());
        }
    }

    return { today, total: solvedPuzzles.length, completedCategories };
  }
}
