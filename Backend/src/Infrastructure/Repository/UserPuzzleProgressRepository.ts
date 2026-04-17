import { IUserPuzzleProgressRepository } from "../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { EUserPuzzleprogress } from "../../Domain/Entity/UserPuzzleProgress";
import { ProgressPuzzleModel } from "../Database/Model/PuzzleModel";

export class UserPuzzleProgressRepository
implements IUserPuzzleProgressRepository
{
  async findByUserAndPuzzle(
    userId: string,
    puzzleId: string,
  ): Promise<EUserPuzzleprogress | null> {
    const doc = await ProgressPuzzleModel.findOne({ userId, puzzleId });
    if (!doc) return null;
    return new EUserPuzzleprogress({
      id: doc._id.toString(),
      userId: doc.userId,
      puzzleId: doc.puzzleId,
      solved: doc.solved,
      attempts: doc.attempts,
      solvedAt: doc.solvedAt,
    });
  }

  async save(progress: EUserPuzzleprogress): Promise<EUserPuzzleprogress> {
    const updated = await ProgressPuzzleModel.findOneAndUpdate(
      { userId: progress.userId, puzzleId: progress.puzzleId },
      {
        solved: progress.solved,
        attempts: progress.attempts,
        solvedAt: progress.solvedAt,
      },
      { upsert: true, new: true },
    );
    return new EUserPuzzleprogress({
      id: updated._id.toString(),
      userId: updated.userId,
      puzzleId: updated.puzzleId,
      solved: updated.solved,
      attempts: updated.attempts,
      solvedAt: updated.solvedAt,
    });
  }

  async getSolvedPuzzles(userId: string): Promise<string[]> {
    return ProgressPuzzleModel.find({ userId, solved: true }).distinct(
      "puzzleId",
    );
  }

  async countSolvedToday(userId: string): Promise<number> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return ProgressPuzzleModel.countDocuments({
      userId,
      solved: true,
      solvedAt: { $gte: todayStart },
    });
  }
}
