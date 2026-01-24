import { GetAllPuzzleOutputDTO,GetallPuzzleInputDTO } from "../../../..//DTOs/adminDTOs";

export interface IGetAllPuzzleUseCase{
    execute(input?:GetallPuzzleInputDTO):Promise<GetAllPuzzleOutputDTO>
}

