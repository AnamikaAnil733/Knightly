import { PuzzleResponseDTO } from "../../../../DTOs/adminDTOs";
import { CreatePuzzleInputDTO } from "../../../../DTOs/adminDTOs";

export interface ICreatePuzzleUseCase{
    execute(input:CreatePuzzleInputDTO):Promise<PuzzleResponseDTO>
}