import { IValidateMoveusecase } from "../../../../Domain/Interface/Usecases/User/PuzzleManagement/IValidatePuzzlesMoves";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IUserPuzzleProgressRepository } from "../../../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { EUserPuzzleprogress } from "../../../../Domain/Entity/UserPuzzleProgress";

export class ValidatePuzzlesMoves implements IValidateMoveusecase {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly _progressRepository: IUserPuzzleProgressRepository,
  ) {}

  async execute(input: {
    userId: string;
    puzzleId: string;
    move: string;
    moveIndex: number;
  }): Promise<{ correct: boolean; nextMove?: string; solved: boolean }> {
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
      return {
        correct: true,
        solved: true,
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
      return {
        correct: true,
        nextMove: puzzle.moves[engineResponseIndex],
        solved: true,
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
}
