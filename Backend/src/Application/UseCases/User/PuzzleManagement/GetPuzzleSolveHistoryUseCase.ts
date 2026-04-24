import { IGetPuzzleSolveHistoryUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveHistoryUseCase";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";

export class GetPuzzleSolveHistoryUseCase implements IGetPuzzleSolveHistoryUseCase {
  constructor(
    private readonly _progressRepository: IUserPuzzleProgressRepository,
  ) {}

  async execute(userId: string): Promise<Date[]> {
    return this._progressRepository.getSolveHistory(userId);
  }
}
