import { AuthRequestDTO } from "../../../DTOs/AuthDTO";

export interface ISignUpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}
