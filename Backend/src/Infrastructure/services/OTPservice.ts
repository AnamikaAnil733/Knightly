// src/Infrastructure/services/OtpService.ts

import { IOtpService } from "../../Domain/Interface/service/otpService";
import { logger } from "../../Infrastructure/logger/logger";
import { ICachingService } from "../../Domain/Interface/service/cachingService";
import { OTP_CACHE_PREFIX } from "../../Domain/Constants/emailHtml/otpcache";

export class OtpService implements IOtpService {

  constructor(private _cachingService: ICachingService) {}

  generateOtp(length: number = 7): string {
    const digits = "123456789";
    let OTP = "";

    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * digits.length)];
    }

    logger.info(`Generated OTP: ${OTP}`);
    return OTP;
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    const key = `${OTP_CACHE_PREFIX}:${email.trim()}`;
    await this._cachingService.setData(key, otp, 300);

    logger.info(`Stored OTP - key: ${key}, otp: ${otp}`);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const key = `${OTP_CACHE_PREFIX}:${email.trim()}`;
    const storedOtp = await this._cachingService.getData<string>(key);

    logger.info(`Verify OTP:
      - Key: ${key}
      - Stored: ${storedOtp}
      - Given: ${otp}
    `);

    return storedOtp === otp;
  }
}
