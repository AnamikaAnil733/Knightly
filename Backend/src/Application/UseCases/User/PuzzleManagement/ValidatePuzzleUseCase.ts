import { IValidateMoveusecase } from "../../../../Domain/Interface/usecases/User/puzzleManagement/IValidatePuzzlesMoves";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { EUserPuzzleprogress } from "../../../../Domain/Entity/UserPuzzleProgress";

export class ValidatePuzzlesMoves implements IValidateMoveusecase {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly _progressRepository: IUserPuzzleProgressRepository
  ) {}

  async execute(input: {
    userId: string;
    puzzleId: string;
    move: string;
  }): Promise<{ correct: boolean; nextMove?: string; solved: boolean }> {
    const { userId, puzzleId, move } = input;
    if (!userId) throw new Error("userId is required");
    if (!puzzleId) throw new Error("puzzleId is required");
    if (!move) throw new Error("move is required");

    const puzzle = await this._puzzleRepository.findById(puzzleId);
    if (!puzzle) throw new Error("Puzzle is not found");

    let progress = await this._progressRepository.findByUserAndPuzzle(
      userId,
      puzzleId
    );

    const currentIndex = progress?.attempts ?? 0;
    const expectedMove = puzzle.moves[currentIndex];

    if (move !== expectedMove) {
      return {
        correct: false,
        solved: false,
      };
    }

    if (!progress) {
      progress = new EUserPuzzleprogress({
        userId,
        puzzleId,
      });
    }

    // Current user move is correct.
    const engineResponseIndex = currentIndex + 1;

    // Check if there are no more moves after this user move
    if (engineResponseIndex >= puzzle.moves.length) {
      progress.incrementAttempts(); // Total moves made matches puzzle moves
      progress.markSolved();
      await this._progressRepository.save(progress);
      return {
        correct: true,
        solved: true,
      };
    }

    progress.attempts = currentIndex + 2;

    // Check if the engine move was the last move in the puzzle
    const nextUserMoveIndex = currentIndex + 2;
    if (nextUserMoveIndex >= puzzle.moves.length) {
      progress.markSolved();
      await this._progressRepository.save(progress);
      return {
        correct: true,
        nextMove: puzzle.moves[engineResponseIndex],
        solved: true,
      };
    }

    await this._progressRepository.save(progress);

    return {
      correct: true,
      nextMove: puzzle.moves[engineResponseIndex],
      solved: false,
    };
  }
}
