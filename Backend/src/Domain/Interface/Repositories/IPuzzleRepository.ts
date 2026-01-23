import { PuzzleType } from "../../Types/PuzzleTypes";
import { IBaseRepository } from "./BaseRepository";
import { EPuzzle } from "../../Entity/puzzle";

export interface IPuzzleRepository extends IBaseRepository<EPuzzle,string>{
    findAll(filter?: { difficulty?: PuzzleType }):Promise<EPuzzle[]>;
    softDelete(id:string):Promise<boolean>
}