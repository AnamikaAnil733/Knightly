import { BaseRepository } from "./BaseRepository";
import { ProgressPuzzleModel, PuzzleModel } from "../Database/Model/PuzzleModel";
import { EPuzzle } from "../../Domain/Entity/Puzzle";
import { PuzzleSchemaType } from "../Database/Schema/PuzzleSchema";
import { IPuzzleRepository } from "../../Domain/Interface/Repositories/IPuzzleRepository";
import { MongoPuzzleMapper } from "../Mapper/MongoPuzzleMapper";
import { PuzzleType } from "Domain/Types/PuzzleTypes";
import { getPagination } from "../Database/Utils/Pagination";
import mongoose, { HydratedDocument } from "mongoose";

export class PuzzleManagementRepository
  extends BaseRepository<EPuzzle, PuzzleSchemaType>
  implements IPuzzleRepository
{
  constructor() {
    super(PuzzleModel, MongoPuzzleMapper);
  }

  async findAll(input?: {
    page?: number;
    limit?: number;
    difficulty?: PuzzleType;
  }): Promise<{
    puzzles: EPuzzle[];
    total: number;
  }> {
    const { page, limit, skip } = getPagination(input);

    const query: Partial<PuzzleSchemaType> & { isActive: boolean } = {
      isActive: true,
    };

    if (input?.difficulty) {
      query.difficulty = input.difficulty;
    }

    const [docs, total] = await Promise.all([
      this.model.find(query).sort({ createdAt: -1, _id: 1 }).skip(skip).limit(limit),

      this.model.countDocuments(query),
    ]);

    return {
      puzzles: docs.map((doc) => MongoPuzzleMapper.toEntityFromDocument(doc)),
      total,
    };
  }

  async softDelete(id: string): Promise<boolean> {
    const puzzle = await this.findById(id);

    if (!puzzle) {
      return false;
    }

    puzzle.deactivate();
    await this.update(puzzle);

    return true;
  }

  async getPuzzleByDifficulty(
    userId: string,
    difficulty: PuzzleType,
  ): Promise<EPuzzle | null> {
    const solvedPuzzleId = await ProgressPuzzleModel.find({
      userId,
      solved: true,
    }).distinct("puzzleId");
    const objectIds = solvedPuzzleId.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    const docs = await PuzzleModel.aggregate([
      {
        $match: {
          difficulty,
          isActive: true,
          _id: { $nin: objectIds },
        },
      },
      { $sample: { size: 1 } },
    ]);

    if (!docs.length) {
      return null;
    }
    const doc = docs[0] as HydratedDocument<PuzzleSchemaType>;
    return MongoPuzzleMapper.toEntityFromDocument(doc);
  }
}
