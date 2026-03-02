import { AuthRequestDTO } from "../../../Domain/DTOs/AuthDTO";
import { IEmailService } from "../../../Domain/Interface/Service/IEmailService";
import { IOtpService } from "../../../Domain/Interface/Service/IOtpService";
import { IResendOtpUsecase } from "../../../Domain/Interface/Usecases/Authentication/IResendOtpUseCases";
import { IUserRepository } from "../../../Domain/Interface/Repositories/IUserRepository";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";

export class ResendOtpUseCase implements IResendOtpUsecase {
  constructor(
    private _otpService: IOtpService,
    private _emailService: IEmailService,
    private _AuthRepository: IUserRepository
  ) {}

  async execute(data: AuthRequestDTO): Promise<void> {
    const { email } = data;
    const existingUser = await this._AuthRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.USER_ALREADY_EXISTS
      );
    }
    const otp = this._otpService.generateOtp(7);
    await this._otpService.storeOtp(email, otp);
    await this._emailService.sendMail({
      to: email,
      displayname: "User",
      otp,
      subject: "Your Knightly OTP",
      content: "Use this OTP to verify your account.",
    });
  }
}
