import { IUserPuzzleProgressRepository } from "../../Domain/Interface/Repositories/IUserPuzzleProgressRepository";
import { EUserPuzzleprogress } from "../../Domain/Entity/UserPuzzleProgress";
import { ProgressPuzzleModel } from "../Database/Model/PuzzleModel";
import { MongoUserPuzzleProgressMapper } from "../Mapper/MongoUserPuzzleProgressMapper";

export class UserPuzzleProgressRepository
implements IUserPuzzleProgressRepository
{
  async findByUserAndPuzzle(
    userId: string,
    puzzleId: string,
  ): Promise<EUserPuzzleprogress | null> {
    const doc = await ProgressPuzzleModel.findOne({ userId, puzzleId });
    if (!doc) return null;
    return MongoUserPuzzleProgressMapper.toEntityFromDocument(doc as any);
  }

  async save(progress: EUserPuzzleprogress): Promise<EUserPuzzleprogress> {
    const data = MongoUserPuzzleProgressMapper.toDocumentFromEntity(progress);
    const updated = await ProgressPuzzleModel.findOneAndUpdate(
      { userId: progress.userId, puzzleId: progress.puzzleId },
      data,
      { upsert: true, new: true },
    );
    return MongoUserPuzzleProgressMapper.toEntityFromDocument(updated as any);
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

  async getSolveHistory(userId: string): Promise<Date[]> {
    const solvedPuzzles = await ProgressPuzzleModel.find(
      { userId, solved: true },
      { solvedAt: 1, _id: 0 },
    ).lean();

    return solvedPuzzles
      .map((p) => (p as any).solvedAt)
      .filter((date): date is Date => !!date);
  }
}
