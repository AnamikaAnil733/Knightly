import { AuthRequestDTO } from "../../../DTOs/AuthDTO";

export interface IResendOtpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}
