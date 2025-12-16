import { AuthRequestDTO,AuthResponseDTO } from "../../../../Application/DTOs/authDTO";


export interface ILoginUseCase{
    execute(data:AuthRequestDTO):Promise<AuthResponseDTO>
}