import { AuthRequestDTO } from "../../../DTOs/authDTO";

export interface IResendOtpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}
