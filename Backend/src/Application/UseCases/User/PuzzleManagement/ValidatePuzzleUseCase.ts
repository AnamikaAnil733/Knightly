import { IValidateMoveusecase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IValidatePuzzlesMoves";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { EUserPuzzleprogress } from "../../../../Domain/Entity/UserPuzzleProgress";
import { IUserRepository } from "../../../../Domain/Interface/Repositories/IUserRepository";
import { ICheckAndAwardAchievementUseCase } from "../../../../Domain/Interface/Usecases/User/AchievementManagement/ICheckAndAwardAchievementUseCase";
import { IGetPuzzleSolveCountUseCase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IGetPuzzleSolveCountUseCase";

export class ValidatePuzzlesMoves implements IValidateMoveusecase {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly _progressRepository: IUserPuzzleProgressRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _checkAndAward: ICheckAndAwardAchievementUseCase,
    private readonly _getPuzzleCount: IGetPuzzleSolveCountUseCase
  ) {}

  async execute(input: {
    userId: string;
    puzzleId: string;
    move: string;
    moveIndex: number;
  }): Promise<{ correct: boolean; nextMove?: string; solved: boolean; currentStreak?: number; allCompleted?: boolean }> {
    const { userId, puzzleId, move, moveIndex } = input;
    if (!userId) throw new Error("userId is required");
    if (!puzzleId) throw new Error("puzzleId is required");
    if (!move) throw new Error("move is required");
    if (moveIndex === undefined) throw new Error("moveIndex is required");

    const puzzle = await this._puzzleRepository.findById(puzzleId);
    if (!puzzle) throw new Error("Puzzle is not found");

    const expectedMove = puzzle.moves[moveIndex];

    let progress = await this._progressRepository.findByUserAndPuzzle(
      userId,
      puzzleId,
    );

    if (move !== expectedMove) {
      return {
        correct: false,
        solved: false,
      };
    }

    // Current user move is correct.
    const engineResponseIndex = moveIndex + 1;

    // Check if there are no more moves after this user move
    if (engineResponseIndex >= puzzle.moves.length) {
      if (!progress) {
        progress = new EUserPuzzleprogress({ userId, puzzleId });
      }
      progress.attempts = moveIndex + 1;
      progress.markSolved();
      await this._progressRepository.save(progress);
      
      // Auto-trigger achievements for PUZZLES_SOLVED
      const { total } = await this._getPuzzleCount.execute(userId);
      await this._checkAndAward.execute(userId, 'PUZZLES_SOLVED', total);

      const currentStreak = await this._handleStreak(userId, puzzleId);
      return {
        correct: true,
        solved: true,
        currentStreak,
        allCompleted: await this._isCategoryCompleted(userId, puzzle.difficulty)
      };
    }

    // Check if the engine move was the last move in the puzzle
    const nextUserMoveIndex = moveIndex + 2;
    if (nextUserMoveIndex >= puzzle.moves.length) {
      if (!progress) {
        progress = new EUserPuzzleprogress({ userId, puzzleId });
      }
      progress.attempts = moveIndex + 2;
      progress.markSolved();
      await this._progressRepository.save(progress);

      // Auto-trigger achievements for PUZZLES_SOLVED
      const { total } = await this._getPuzzleCount.execute(userId);
      await this._checkAndAward.execute(userId, 'PUZZLES_SOLVED', total);

      const currentStreak = await this._handleStreak(userId, puzzleId);
      return {
        correct: true,
        nextMove: puzzle.moves[engineResponseIndex],
        solved: true,
        currentStreak,
        allCompleted: await this._isCategoryCompleted(userId, puzzle.difficulty)
      };
    }

    // Update progress normally
    if (!progress) {
      progress = new EUserPuzzleprogress({ userId, puzzleId });
    }
    progress.attempts = moveIndex + 2;
    await this._progressRepository.save(progress);

    await this._progressRepository.save(progress);

    return {
      correct: true,
      nextMove: puzzle.moves[engineResponseIndex],
      solved: false,
    };
  }

  private async _handleStreak(userId: string, puzzleId: string): Promise<number | undefined> {
    const { puzzles } = await this._puzzleRepository.findAll({ limit: 5000 });
    if (puzzles.length === 0) return undefined;

    const now = new Date();
    const samePuzzleToEveryone = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const dailyPuzzle = puzzles[samePuzzleToEveryone % puzzles.length];

    if (dailyPuzzle.id === puzzleId) {
      const user = await this._userRepository.findById(userId);
      if (user) {
        user.updatePuzzleStreak(now);
        await this._userRepository.update(user);

        // Auto-trigger achievements for strakdays
        await this._checkAndAward.execute(userId, 'STREAK_DAYS', user.currentStreak);

        return user.currentStreak;
      }
    }
    return undefined;
  }

  private async _isCategoryCompleted(userId: string, difficulty: string): Promise<boolean> {
    const unsolvedCount = await this._puzzleRepository.countUnsolvedByCategory(userId, difficulty as any);
    return unsolvedCount === 0;
  }
}
