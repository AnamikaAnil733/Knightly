import { IGetPuzzleSolveCountUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveCountUseCase";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";

export class GetPuzzleSolveCountUseCase implements IGetPuzzleSolveCountUseCase {
  constructor(
        private readonly _progressRepository: IUserPuzzleProgressRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this._progressRepository.countSolvedToday(userId);
  }
}
