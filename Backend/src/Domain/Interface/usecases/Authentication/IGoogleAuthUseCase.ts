import { AuthResponseDTO } from "../../../DTOs/AuthDTO";
import { GoogleAuthRequestDTO } from "../../../DTOs/GoogleAuthDTO";

export interface IGoogleAuthUseCase {
  execute(data: GoogleAuthRequestDTO): Promise<AuthResponseDTO>;
}
