import { EUserPuzzleprogress } from "../../Entity/userPuzzleProgress";

export interface IUserPuzzleProgressRepository{
    findByUserAndPuzzle(userId:string,puzzleId:string):Promise<EUserPuzzleprogress|null>
    save(progress:EUserPuzzleprogress):Promise<EUserPuzzleprogress>;
    getSolvedPuzzles(userId:string):Promise<string[]>
}