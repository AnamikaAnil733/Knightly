import { PuzzleType } from "../../Types/PuzzleTypes";
import { IBaseRepository } from "./BaseRepository";
import { EPuzzle } from "../../Entity/puzzle";

export interface IPuzzleRepository extends IBaseRepository<EPuzzle,string>{
    findAll(
        input?: { page?: number; limit?: number; difficulty?: PuzzleType }
      ): Promise<{ puzzles: EPuzzle[]; total: number }>;
      
    softDelete(id:string):Promise<boolean>
}