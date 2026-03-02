import { IOtpService } from "../../../Domain/Interface/Service/IOtpService";
import { ICachingService } from "../../../Domain/Interface/Service/ICachingService";
import { IVerifyOtpUseCase } from "../../../Domain/Interface/Usecases/Authentication/IVerifyOtpUseCase";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _cachingService: ICachingService
  ) {}

  async execute(email: string, otp: string): Promise<boolean> {
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (isValid) {
      await this._cachingService.setData(`VERIFIED_USER:${email}`, true, 600); // store for 10 min
    }
    return isValid;
  }
}
