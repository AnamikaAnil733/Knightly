import { AuthResponseDTO } from "../../../DTOs/authDTO";
import { GoogleAuthRequestDTO } from "../../../DTOs/googleAuthDTO";

export interface IGoogleAuthUseCase{
    execute(data:GoogleAuthRequestDTO):Promise<AuthResponseDTO>;
}
