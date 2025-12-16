import { AuthRepository } from "../Repository/AuthRepository";

import { CachingService } from "../services/cachingService";
import { OtpService } from "../services/OTPservice";
import { EmailService } from "../services/EmilService";
import { HashService } from "../services/passwordHashing";
import { GoogleAuthService } from "../services/GoogleAuthService";
import { TokenService } from "../services/tokenService"

import { AuthController } from "../../Presentation/controllers/Authcontroller";

import { VerifyOtpUseCase } from "../../Application/UseCases/Auth/VerifyOtpUsecases";
import { RegisterUserUseCase } from "../../Application/UseCases/Auth/RegisterUserCase";
import { LoginUseCase } from "../../Application/UseCases/Auth/LoginUseCase";
import { ResendOtpUseCase } from "../../Application/UseCases/Auth/ResendOtpUseCase";
import { ForgetPasswordUseCase } from "../../Application/UseCases/Auth/forgetPasswordUsecase";
import { ResetPaswordUseCase } from "../../Application/UseCases/Auth/ResetPasswordUseCase";
import { GoogleAuthUseCase } from "../../Application/UseCases/Auth/googleAuthUseCase";


const UserRepo = new AuthRepository();
const cache = new CachingService();
const otpService = new OtpService(cache);
const emailService = new EmailService();
const hashService = new HashService();
const tokenservice = new TokenService()
const googleAuthService = new GoogleAuthService()

//useCases
const verifyOtpUseCase = new VerifyOtpUseCase(otpService,cache);
const registerUserUseCase = new RegisterUserUseCase(UserRepo,cache,hashService);
const loginUserCase = new LoginUseCase(UserRepo,hashService);
const resendOtpUseCase  = new ResendOtpUseCase(otpService,emailService,UserRepo);
const forgetPassword = new ForgetPasswordUseCase(emailService,otpService,UserRepo)
const resetPassword = new ResetPaswordUseCase(cache,hashService,UserRepo)
const googleAuthUseCase = new GoogleAuthUseCase(UserRepo,googleAuthService)

//injection
export const authController = new AuthController(
    verifyOtpUseCase,
    registerUserUseCase,
    loginUserCase,
    resendOtpUseCase,
    forgetPassword,
    resetPassword,
    googleAuthUseCase,
    tokenservice
)

