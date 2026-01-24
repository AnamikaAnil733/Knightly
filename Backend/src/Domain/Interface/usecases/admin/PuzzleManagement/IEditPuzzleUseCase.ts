import { UpdatePuzzleInputDTO,
    PuzzleResponseDTO} from "../../../../DTOs/adminDTOs";


    export interface IEditPuzzleUsecase{
        execute(input:UpdatePuzzleInputDTO):Promise<PuzzleResponseDTO>
    }