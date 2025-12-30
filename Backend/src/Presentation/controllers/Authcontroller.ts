import { NextFunction, Request, Response } from "express";

import { IVerifyOtpUseCase } from "Domain/Interface/usecases/authentication/IVerifyOtpUseCase";
import { IRegisterUserUseCase } from "Domain/Interface/usecases/authentication/IRegisterUseCase";
import { ILoginUseCase } from "Domain/Interface/usecases/authentication/ILoginUseCases";
import { IResendOtpUsecase } from "Domain/Interface/usecases/authentication/IResendOtpUseCases";
import { IforgetPasswordUseCase } from "Domain/Interface/usecases/authentication/IforgetPasswordUseCase";
import { IResetPasswordUseCase } from "Domain/Interface/usecases/authentication/IResetPasswordUseCase";
import { IGoogleAuthUseCase } from "Domain/Interface/usecases/authentication/IGoogleAuthUseCase";

import { logger } from "../../Infrastructure/logger/logger";

import {
  AuthRequestSchema,
  SignupRequestSchema,
  VerifyOtpRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
  GoogleAuthRequestSchema,
  LoginRequestSchema
} from "../Validators/authValidator";

import { CustomError } from "../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../Domain/Types/statusCode";
import { MESSAGES } from "../../Domain/Constants/Messages/Messages";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";

export class AuthController {
  constructor(
    private verifyOtpUseCase: IVerifyOtpUseCase,
    private registerUserUseCase: IRegisterUserUseCase,
    private loginUseCase: ILoginUseCase,
    private resendOtpUseCase: IResendOtpUsecase,
    private forgetPasswordUseCase: IforgetPasswordUseCase,
    private resetPasswordUseCase: IResetPasswordUseCase,
    private googleAuthUseCase: IGoogleAuthUseCase,
    private tokenService: ITokenService
  ) {}

  // ---------------- VERIFY OTP ----------------
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = VerifyOtpRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      const { email, otp } = result.data;
      const isValid = await this.verifyOtpUseCase.execute(email, otp);

      if (!isValid) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.INVALID_OTP
        );
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "OTP verified successfully. Please login.",
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - verifyOtp");
      next(error);
    }
  };

  // ---------------- REGISTER ----------------
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = SignupRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      const user = await this.registerUserUseCase.execute(result.data);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - register");
      next(error);
    }
  };

  // ---------------- LOGIN ----------------

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = LoginRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      const user = await this.loginUseCase.execute(result.data);

      const { refreshToken } = this.tokenService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });


      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Logged in successfully",
        userInfo: user,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - login");
      next(error);
    }
  };

  // ---------------- RESEND OTP ----------------
  resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      const result = ForgotPasswordRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      await this.resendOtpUseCase.execute(result.data);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - resendOTP");
      next(error);
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = ForgotPasswordRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      await this.forgetPasswordUseCase.execute(result.data);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "OTP sent to email",
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - forgetPassword");
      next(error);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = ResetPasswordRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      const { email, password } = result.data;
      await this.resetPasswordUseCase.execute(password, email);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - resetPassword");
      next(error);
    }
  };

  // ---------------- GOOGLE AUTH ----------------
  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = GoogleAuthRequestSchema.safeParse(req.body);
      console.log(result)
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY
        );
      }

      const user = await this.googleAuthUseCase.execute(result.data);

      const { refreshToken } = this.tokenService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const accessToken = this.tokenService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Logged in successfully",
        userInfo: user,
        accessToken,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - googleAuth");
      next(error);
    }
  };

  // ---------------- REFRESH TOKEN ----------------
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.UNAUTHORIZED
        );
      }

      const payload = this.tokenService.verifyRefreshToken(refreshToken);

      const accessToken = this.tokenService.generateAccessToken({
        userId: payload.userId,
        role: payload.role,
      });

      const newRefresh = this.tokenService.generateRefreshToken({
        userId: payload.userId,
        role: payload.role,
      });

      res.cookie("refreshToken", newRefresh.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      logger.error({ error }, "ERROR: AuthController - refresh");
      next(error);
    }
  };
}
