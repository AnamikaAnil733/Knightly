import { AuthRequestDTO } from "../../../DTOs/authDTO";

export interface ISignUpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}
