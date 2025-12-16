import { IforgetPasswordUseCase } from "../../../Domain/Interface/usecases/authentication/IforgetPasswordUseCase";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository"
import { IEmailService } from "../../../Domain/Interface/service/emailService";
import { IOtpService } from "../../../Domain/Interface/service/otpService";
import { AuthRequestDTO } from "../../DTOs/authDTO";

export class ForgetPasswordUseCase implements IforgetPasswordUseCase{
    constructor(
        private _emailservice:IEmailService,
        private _otpservice:IOtpService,
        private _userRepo:IUserRepository
    ){}

   async execute(data: AuthRequestDTO): Promise<void> {
    const {email,displayname} = data
        const existingUser = await this._userRepo.findByEmail(email)
        if(existingUser && existingUser.googleId){
            throw new CustomError(
                HttpStatusCodes.CONFLICT,
                MESSAGES.GOOGLE_RESET_PASSWORD
            )
        }
        if(existingUser && !existingUser.isBlocked){
            const otp = this._otpservice.generateOtp(7)
            await this._otpservice.storeOtp(email,otp)
            await this._emailservice.sendMail({
                to:email,
                displayname:displayname!,
                otp,
                subject:"Your Forget Password OTP",
                content:"Use this OTP to verfify your account"
            })

        }else{
            throw new CustomError(
                HttpStatusCodes.NOT_FOUND,
                MESSAGES.USER_DOESNT_EXIST
            )
        }
    }

}



