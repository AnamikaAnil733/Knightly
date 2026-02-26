import { IforgetPasswordUseCase } from "../../../Domain/Interface/Usecases/Authentication/IforgetPasswordUseCase";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/StatusCode";
import { IUserRepository } from "../../../Domain/Interface/Repositories/IUserRepository";
import { IEmailService } from "../../../Domain/Interface/Service/IEmailService";
import { IOtpService } from "../../../Domain/Interface/Service/IOtpService";
import { AuthRequestDTO } from "../../../Domain/DTOs/AuthDTO";

export class ForgetPasswordUseCase implements IforgetPasswordUseCase{
  constructor(
        private _emailservice:IEmailService,
        private _otpservice:IOtpService,
        private _userRepo:IUserRepository,
  ){}

  async execute(data: AuthRequestDTO): Promise<void> {
    const {email} = data;
    console.log(email);
    const existingUser = await this._userRepo.findByEmail(email);
    if(existingUser && existingUser.googleId){
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.GOOGLE_RESET_PASSWORD,
      );
    }
    if(existingUser && !existingUser.isBlocked){
      const otp = this._otpservice.generateOtp(7);
      await this._otpservice.storeOtp(email,otp);
      await this._emailservice.sendMail({
        to:email,
        displayname:"User",
        otp,
        subject:"Your Forget Password OTP",
        content:"Use this OTP to verfify your account",
      });

    }else{
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DOESNT_EXIST,
      );
    }
  }

}



