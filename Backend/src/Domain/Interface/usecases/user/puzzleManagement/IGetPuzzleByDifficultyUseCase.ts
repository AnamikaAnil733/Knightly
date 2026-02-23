import { UserPuzzleResponseDTO } from "../../../../DTOs/userDTOs"
import { PuzzleType } from "../../../../Types/PuzzleTypes"

export interface IGetPuzzleByDifficulty{
    execute(userId:string,difficulty:PuzzleType):Promise<UserPuzzleResponseDTO>
}