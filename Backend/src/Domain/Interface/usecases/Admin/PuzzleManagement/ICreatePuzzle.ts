import {
  PuzzleResponseDTO,
  CreatePuzzleInputDTO,
} from "../../../../DTOs/AdminDTOs";

export interface ICreatePuzzleUseCase {
  execute(input: CreatePuzzleInputDTO): Promise<PuzzleResponseDTO>;
}
