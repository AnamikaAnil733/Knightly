import { PuzzleResponseDTO,
  CreatePuzzleInputDTO,
} from "../../../../DTOs/adminDTOs";

export interface ICreatePuzzleUseCase{
    execute(input:CreatePuzzleInputDTO):Promise<PuzzleResponseDTO>
}
