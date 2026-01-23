import { PuzzleType } from "../../Types/PuzzleTypes";
import { IBaseRepository } from "./BaseReository";
import { Puzzle } from "../../Entity/puzzle";

export interface IPuzzleRepository extends IBaseRepository<Puzzle,string>{
    findAll(files?:{difficulty?:PuzzleType}):Promise<Puzzle[]>

}