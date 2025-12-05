import { IOtpService } from "../../../Domain/Interface/service/otpService";
import { ICachingService } from "../../../Domain/Interface/service/cachingService";

export class VerifyOtpUseCase {
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
