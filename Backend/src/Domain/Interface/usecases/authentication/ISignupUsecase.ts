import { AuthRequestDTO } from "../../../../Application/DTOs/authDTO";

export interface ISignUpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}