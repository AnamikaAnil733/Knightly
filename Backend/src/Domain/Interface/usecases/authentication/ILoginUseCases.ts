import { AuthRequestDTO,AuthResponseDTO } from "../../../DTOs/authDTO";


export interface ILoginUseCase{
    execute(data:AuthRequestDTO):Promise<AuthResponseDTO>
}
