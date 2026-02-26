import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import {
  CreatePuzzleInputDTO,
  PuzzleResponseDTO,
} from "../../../../Domain/DTOs/adminDTOs";
import { EPuzzle } from "../../../../Domain/Entity/puzzle";
import { PuzzleMapper } from "../../../mapper/PuzzleMapper";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import { ICreatePuzzleUseCase } from "../../../../Domain/Interface/usecases/admin/PuzzleManagement/ICreatePuzzle";
import { IPuzzleValidationService } from "../../../../Domain/Interface/service/IPuzzleValidationService";

export class CreatePuzzleUseCase implements ICreatePuzzleUseCase {
  constructor(
    private readonly _puzzleRepository: IPuzzleRepository,
    private readonly puzzleValidationService: IPuzzleValidationService,
  ) {}

  async execute(input: CreatePuzzleInputDTO): Promise<PuzzleResponseDTO> {
    //validation
    if (!input.fen || !input.fen.trim()) {
      throw new Error("fen is required");
    }
    if (!input.moves || input.moves.length === 0) {
      throw new Error("Atleast one move is required");
    }
    if (!Object.values(PuzzleType).includes(input.difficulty)) {
      throw new Error("Invaild Puzzle Difficulty");
    }

    const validation = this.puzzleValidationService.validatePuzzle(
      input.fen,
      input.moves,
    );
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const Puzzle = new EPuzzle({
      fen: input.fen,
      difficulty: input.difficulty,
      moves: input.moves,
    });

    const createPuzzle = await this._puzzleRepository.create(Puzzle);

    return PuzzleMapper.toPuzzleResposeDTO(createPuzzle);
  }
}
