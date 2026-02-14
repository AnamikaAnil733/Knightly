import { BaseRepository } from "./BaseRepository";
import { PuzzleModel } from "../database/model/puzzleModel";
import { EPuzzle } from "../../Domain/Entity/puzzle";
import { PuzzleSchemaType } from "../database/Schema/puzzleSchema";
import { IPuzzleRepository } from "../../Domain/Interface/Repositories/IPuzzleRepository";
import { PuzzleMapper } from "../../Application/mapper/PuzzleMapper";
import { PuzzleType } from "Domain/Types/PuzzleTypes";
import { getPagination } from "../database/utils/pagination";


export class PuzzleManagementRepository extends BaseRepository<EPuzzle,PuzzleSchemaType>
  implements IPuzzleRepository{
  constructor(){
    super(PuzzleModel,PuzzleMapper);
  }

  async findAll(
    input?: {
        page?: number;
        limit?: number;
        difficulty?: PuzzleType;
      },
  ): Promise<{
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
      this.model
        .find(query)
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),

      this.model.countDocuments(query),
    ]);

    return {
      puzzles: docs.map((doc) =>
        PuzzleMapper.toEntityFromDocument(doc),
      ),
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





}
