import { IPuzzleRepository } from "../../../../Domain/Interface/Repositories/IPuzzleRepository";
import { UpdatePuzzleInputDTO,PuzzleResponseDTO } from "../../../../Domain/DTOs/adminDTOs";
import { PuzzleMapper } from "../../../mapper/PuzzleMapper";
import { PuzzleType } from "../../../../Domain/Types/PuzzleTypes";
import {IEditPuzzleUsecase} from "../../../../Domain/Interface/usecases/admin/PuzzleManagement/IEditPuzzleUseCase";
import { PuzzleValidationService } from "../../../Services/PuzzleValidationService";



export class EditPuzzleUseCase implements IEditPuzzleUsecase{
  constructor(private readonly _puzzleRepository:IPuzzleRepository){}

  async execute(input: UpdatePuzzleInputDTO): Promise<PuzzleResponseDTO> {

    //validation
    if (!input.id) {
      throw new Error("Puzzle id is required");
    }

    const puzzle = await this._puzzleRepository.findById(input.id);
    if(!puzzle){
      throw new Error("Puzzle is not found");
    }
    console.log(puzzle);

    if(!input.fen || !input.fen.trim()){
      throw new Error("fen is required");
    }
    if(!input.moves||input.moves.length === 0 ){
      throw new Error("Atleast one move is required");
    }
    if(input.difficulty&&!Object.values(PuzzleType).includes(input.difficulty)){
      throw new Error("Invaild Puzzle Difficulty");
    }

    const validation = PuzzleValidationService.validatePuzzle(input.fen, input.moves);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }


    if (input.fen !== undefined) {
      puzzle.fen = input.fen;
    }

    if (input.difficulty !== undefined) {
      puzzle.difficulty = input.difficulty;
    }

    if (input.moves !== undefined) {
      puzzle.updateMoves(input.moves);
    }

    if (input.isActive !== undefined) {
      puzzle.isActive = input.isActive;
    }


    const updatedPuzzle = await this._puzzleRepository.update(puzzle);
    if(!updatedPuzzle){
      throw new Error("updatedPuzzle is not found");
    }
    return PuzzleMapper.toPuzzleResposeDTO(updatedPuzzle);
  }
}
