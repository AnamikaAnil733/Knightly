import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { IGetAllPuzzleUseCase } from "../../../../Domain/Interface/Usecases/Admin/PuzzleManagement/IGetAllPuzzlesUseCase";
import {
  GetAllPuzzleOutputDTO,
  GetallPuzzleInputDTO,
} from "Domain/DTOs/AdminDTOs";
import { PuzzleMapper } from "../../../Mapper/PuzzleMapper";

export class GetallPuzzleUseCase implements IGetAllPuzzleUseCase {
  constructor(private readonly _puzzlesRepository: IPuzzleRepository) {}

  async execute(input?: GetallPuzzleInputDTO): Promise<GetAllPuzzleOutputDTO> {
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 10;

    const { puzzles, total } = await this._puzzlesRepository.findAll(input);

    return {
      puzzles: puzzles.map(PuzzleMapper.toPuzzleResposeDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
