import { AuthResponseDTO } from "../../../../Application/DTOs/authDTO";
import { GoogleAuthRequestDTO } from "../../../../Application/DTOs/googleAuthDTO";

export interface IGoogleAuthUseCase{
    execute(data:GoogleAuthRequestDTO):Promise<AuthResponseDTO>;
}