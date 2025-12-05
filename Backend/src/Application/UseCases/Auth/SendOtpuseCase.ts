
import { IUserRepository } from "../../../Domain/Interface/UserRepository";
import { IOtpService } from "../../../Domain/Interface/service/otpService";
import { IEmailService } from "../../../Domain/Interface/service/emailService";

export class SendOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _emailService: IEmailService,
    private _userRepo: IUserRepository,
  ) {}

  async execute(email: string,name:string): Promise<void> {
    const userExists = await this._userRepo.findByEmail(email);
    if (userExists) {
      throw new Error("User already exists! Please login instead.");
    }

    const otp = this._otpService.generateOtp(7);

    await this._otpService.storeOtp(email, otp);

    await this._emailService.sendMail({
      to: email,
      name:name,   
      otp,                    
      subject: "Your Knightly OTP",
      content: "Use this OTP to verify your account.",
    });
  }
}
