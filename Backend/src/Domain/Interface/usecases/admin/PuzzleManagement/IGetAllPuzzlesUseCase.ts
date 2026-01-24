import { GetAllPuzzleOutputDTO,GetallPuzzleInputDTO } from "../../../..//DTOs/adminDTOs";

export interface IGetAllPuzzleUseCase{
    excute(input:GetallPuzzleInputDTO):Promise<GetAllPuzzleOutputDTO>
}

