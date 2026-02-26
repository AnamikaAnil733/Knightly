import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { ISoftDeleteUseCase } from "../../../../Domain/Interface/Usecases/Admin/PuzzleManagement/IDeletePuzzleUseCase";

export class SoftDeletePuzzleUseCase implements ISoftDeleteUseCase{
  constructor(private readonly _puzzleRepo:IPuzzleRepository){}

  async execute(id: string): Promise<boolean> {
    if(!id){
      throw new Error("Puzzle id is required");
    }
    const deleted = await this._puzzleRepo.softDelete(id);

    if(!deleted){
      throw new Error("Puzzle not found");
    }
    return true;
  }
}
