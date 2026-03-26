import { IPuzzleGeneratorService } from "../../../../Domain/Interface/Service/IPuzzleGeneratorService";
import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { PuzzleResponseDTO } from "../../../../Domain/DTOs/AdminDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

import { ISyncLichessDailyPuzzleUseCase } from "../../../../Domain/Interface/Usecases/Admin/PuzzleManagement/ISyncLichessDailyPuzzleUseCase";

export class SyncLichessDailyPuzzleUseCase implements ISyncLichessDailyPuzzleUseCase {
  constructor(
        private readonly _puzzleGeneratorService: IPuzzleGeneratorService,
        private readonly _puzzleRepository: IPuzzleRepository,
  ) {}

  async execute(): Promise<PuzzleResponseDTO> {
    const puzzle = await this._puzzleGeneratorService.fetchLichessDaily();
    const createdPuzzle = await this._puzzleRepository.create(puzzle);
    return PuzzleMapper.toPuzzleResposeDTO(createdPuzzle);
  }
}
