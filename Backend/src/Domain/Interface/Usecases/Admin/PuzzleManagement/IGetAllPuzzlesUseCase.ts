import { GetAllPuzzleOutputDTO,GetallPuzzleInputDTO } from "../../../..//DTOs/AdminDTOs";

export interface IGetAllPuzzleUseCase{
    execute(input?:GetallPuzzleInputDTO):Promise<GetAllPuzzleOutputDTO>
}

