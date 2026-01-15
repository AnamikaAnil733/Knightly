import { AuthRequestDTO } from "../../../DTOs/authDTO";

export interface IforgetPasswordUseCase{
    execute(data:AuthRequestDTO):Promise<void>
}
