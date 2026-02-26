import {
  UpdatePuzzleInputDTO,
  PuzzleResponseDTO,
} from "../../../../DTOs/AdminDTOs";

export interface IEditPuzzleUsecase {
  execute(input: UpdatePuzzleInputDTO): Promise<PuzzleResponseDTO>;
}
