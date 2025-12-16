import { AuthRequestDTO } from "../../DTOs/authDTO";
import { IEmailService } from "../../../Domain/Interface/service/emailService";
import { IOtpService } from "../../../Domain/Interface/service/otpService";
import { IResendOtpUsecase } from "../../../Domain/Interface/usecases/authentication/IResendOtpUseCases";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages"



export class ResendOtpUseCase implements IResendOtpUsecase{

    constructor(
        private _otpService:IOtpService,
        private  _emailService:IEmailService,
        private  _AuthRepository:IUserRepository
    ){}

    async execute(data: AuthRequestDTO): Promise<void> {
        const {displayname,email} = data;
        const existingUser = await this._AuthRepository.findByEmail(email);
        if(existingUser){
          throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.USER_ALREADY_EXISTS
            );  
        }
        const otp = this._otpService.generateOtp(7);
        await this._otpService.storeOtp(email,otp)
        await this._emailService.sendMail({
            to: email,
            displayname:displayname!, 
            otp,                    
            subject: "Your Knightly OTP",
            content: "Use this OTP to verify your account.",
          });


    }
}

