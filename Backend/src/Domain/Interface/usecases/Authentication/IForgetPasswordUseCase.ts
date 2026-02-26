import { AuthRequestDTO } from "../../../DTOs/AuthDTO";

export interface IforgetPasswordUseCase {
  execute(data: AuthRequestDTO): Promise<void>;
}
