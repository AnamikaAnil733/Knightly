import { AuthRequestDTO } from "../../../../Application/DTOs/authDTO";

export interface IResendOtpUsecase{
    execute(data:AuthRequestDTO):Promise<void>;
}