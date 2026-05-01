import { IGetPuzzleSolveHistoryUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveHistoryUseCase";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { IChessGameRepository } from "../../../../Domain/Interface/Repositories/IGameRepository";

export class GetPuzzleSolveHistoryUseCase implements IGetPuzzleSolveHistoryUseCase {
  constructor(
    private readonly _progressRepository: IUserPuzzleProgressRepository,
    private readonly _gameRepository: IChessGameRepository
  ) {}

  async execute(userId: string): Promise<Date[]> {
   
    const [puzzleDates, games] = await Promise.all([
      this._progressRepository.getSolveHistory(userId),
      this._gameRepository.findByUserId(userId)
    ]);
    const matchDates = games.map(game => game.createdAt);
    const allDates = [...puzzleDates, ...matchDates];

    return allDates
      .filter((d): d is Date => d !== null && d !== undefined)
      .sort((a, b) => a.getTime() - b.getTime());
  }
}
