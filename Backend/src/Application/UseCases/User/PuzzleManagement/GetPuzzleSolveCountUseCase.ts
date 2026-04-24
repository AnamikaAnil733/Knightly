import { IGetPuzzleSolveCountUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveCountUseCase";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";

export class GetPuzzleSolveCountUseCase implements IGetPuzzleSolveCountUseCase {
  constructor(
        private readonly _progressRepository: IUserPuzzleProgressRepository,
  ) {}

  async execute(userId: string): Promise<{ today: number; total: number }> {
    const today = await this._progressRepository.countSolvedToday(userId);
    const solvedPuzzles = await this._progressRepository.getSolvedPuzzles(userId);
    return { today, total: solvedPuzzles.length };
  }
}
