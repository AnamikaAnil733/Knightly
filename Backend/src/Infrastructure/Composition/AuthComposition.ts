import { AuthRepository } from "../Repository/AuthRepository";

import { CachingService } from "../Services/CachingService";
import { OtpService } from "../Services/OtpService";
import { EmailService } from "../Services/EmailService";
import { HashService } from "../Services/PasswordHashing";
import { GoogleAuthService } from "../Services/GoogleAuthService";
import { TokenService } from "../Services/TokenService";

import { AuthController } from "../../Presentation/Controllers/AuthController";

import { VerifyOtpUseCase } from "../../Application/UseCases/Auth/VerifyOtpUsecases";
import { RegisterUserUseCase } from "../../Application/UseCases/Auth/RegisterUserCase";
import { LoginUseCase } from "../../Application/UseCases/Auth/LoginUseCase";
import { ResendOtpUseCase } from "../../Application/UseCases/Auth/ResendOtpUseCase";
import { ForgetPasswordUseCase } from "../../Application/UseCases/Auth/ForgetPasswordUsecase";
import { ResetPaswordUseCase } from "../../Application/UseCases/Auth/ResetPasswordUseCase";
import { GoogleAuthUseCase } from "../../Application/UseCases/Auth/GoogleAuthUseCase";


const UserRepo = new AuthRepository();
const cache = new CachingService();
const otpService = new OtpService(cache);
const emailService = new EmailService();
const hashService = new HashService();
const tokenservice = new TokenService();
const googleAuthService = new GoogleAuthService();

//useCases
const verifyOtpUseCase = new VerifyOtpUseCase(otpService, cache);
const registerUserUseCase = new RegisterUserUseCase(
  UserRepo,
  cache,
  hashService,
);
const loginUserCase = new LoginUseCase(UserRepo, hashService, tokenservice);
const resendOtpUseCase = new ResendOtpUseCase(
  otpService,
  emailService,
  UserRepo,
);
const forgetPassword = new ForgetPasswordUseCase(
  emailService,
  otpService,
  UserRepo,
);
const resetPassword = new ResetPaswordUseCase(cache, hashService, UserRepo);
const googleAuthUseCase = new GoogleAuthUseCase(
  UserRepo,
  googleAuthService,
  tokenservice,
);

//injection
export const authController = new AuthController(
  verifyOtpUseCase,
  registerUserUseCase,
  loginUserCase,
  resendOtpUseCase,
  forgetPassword,
  resetPassword,
  googleAuthUseCase,
  tokenservice,
);
