import { AuthRequestDTO,AuthResponseDTO } from "../../../DTOs/AuthDTO";


export interface ILoginUseCase{
    execute(data:AuthRequestDTO):Promise<AuthResponseDTO>
}
