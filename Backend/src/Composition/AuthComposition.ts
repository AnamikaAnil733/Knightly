import { UserRepositoryImpl } from "../Infrastructure/Repository/UserRepositoryImpl";
import { CachingService } from "../Infrastructure/services/cachingService";
import { OtpService } from "../Infrastructure/services/OTPservice";
import { EmailService } from "../Infrastructure/services/EmilService";
import { HashService } from "../Infrastructure/services/passwordHashing";

import { SendOtpUseCase } from "../Application/UseCases/Auth/SendOtpuseCase";
import { VerifyOtpUseCase } from "../Application/UseCases/Auth/VerifyOtpUsecases";
import { RegisterUserUseCase } from "../Application/UseCases/Auth/RegisterUserCase";
import { AuthController } from "../Presentation/controllers/Authcontroller";

const UserRepo = new UserRepositoryImpl();
const cache = new CachingService();
const otpService = new OtpService(cache);
const emailService = new EmailService();
const hashService = new HashService();


//useCases
const sendOtpUseCases = new SendOtpUseCase(otpService,emailService,UserRepo);
const verifyOtpUseCase = new VerifyOtpUseCase(otpService,cache);
const registerUserUseCase = new RegisterUserUseCase(UserRepo,cache,hashService);


//injection
export const authController = new AuthController(
    sendOtpUseCases,
    verifyOtpUseCase,
    registerUserUseCase,
)

