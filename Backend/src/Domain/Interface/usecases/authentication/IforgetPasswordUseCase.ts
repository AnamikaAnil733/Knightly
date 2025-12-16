import { AuthRequestDTO } from "../../../../Application/DTOs/authDTO"

export interface IforgetPasswordUseCase{
    execute(data:AuthRequestDTO):Promise<void>
}