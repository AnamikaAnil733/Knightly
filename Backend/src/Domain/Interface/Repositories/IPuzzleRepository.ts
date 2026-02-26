import { PuzzleType } from "../../Types/PuzzleTypes";
import { IBaseRepository } from "./IBaseRepository";
import { EPuzzle } from "../../Entity/Puzzle";

export interface IPuzzleRepository extends IBaseRepository<EPuzzle,string>{
    findAll(
        input?: { page?: number; limit?: number; difficulty?: PuzzleType }
      ): Promise<{ puzzles: EPuzzle[]; total: number }>;

    softDelete(id:string):Promise<boolean>;
    getPuzzleByDifficulty(userId:string,difficulty:PuzzleType):Promise<EPuzzle|null>
}
