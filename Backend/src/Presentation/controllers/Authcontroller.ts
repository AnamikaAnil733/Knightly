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
  LoginRequestSchema,
} from "../Validators/authValidator";

import { CustomError } from "../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../Domain/Types/statusCode";
import { MESSAGES } from "../../Domain/Constants/Messages/Messages";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";

export class AuthController {
  constructor(
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _registerUserUseCase: IRegisterUserUseCase,
    private _loginUseCase: ILoginUseCase,
    private _resendOtpUseCase: IResendOtpUsecase,
    private _forgetPasswordUseCase: IforgetPasswordUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _googleAuthUseCase: IGoogleAuthUseCase,
    private _tokenService: ITokenService,
  ) {}

  // ---------------- VERIFY OTP ----------------
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = VerifyOtpRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      const { email, otp } = result.data;
      const isValid = await this._verifyOtpUseCase.execute(email, otp);

      if (!isValid) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.INVALID_OTP,
        );
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.OTP_VERIFY_SUCCESS,
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
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }
      const user = await this._registerUserUseCase.execute(result.data);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: MESSAGES.USER_REGISTER_SUCCESS,
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
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      const user = await this._loginUseCase.execute(result.data);

      const { refreshToken } = this._tokenService.generateRefreshToken({
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
        message: MESSAGES.LOGIN_SUCCESS,
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
      console.log(req.body);
      const result = ForgotPasswordRequestSchema.safeParse(req.body);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      await this._resendOtpUseCase.execute(result.data);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.OTP_SENT_SUCCESS,
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
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      await this._forgetPasswordUseCase.execute(result.data);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message:MESSAGES.OTP_SENT_EMAIL,
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
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      const { email, password } = result.data;
      await this._resetPasswordUseCase.execute(password, email);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.PASSWORD_RESET,
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
      console.log(result);
      if (!result.success) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_REQUEST_BODY,
        );
      }

      const user = await this._googleAuthUseCase.execute(result.data);

      const { refreshToken } = this._tokenService.generateRefreshToken({
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

      const accessToken = this._tokenService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
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
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({
          message: MESSAGES.REFRESH_TOKEN_MISSING,
        });
      }

      const payload = this._tokenService.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenService.generateAccessToken({
        userId: payload.userId,
        role: payload.role,
      });

      const newRefreshToken = this._tokenService.generateRefreshToken({
        userId: payload.userId,
        role: payload.role,
      });

      res.cookie("refreshToken", newRefreshToken.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      logger.error("REFRESH TOKEN FAILED");
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        message: MESSAGES.INVALID_REFRESH_TOKEN,
      });
    }
  };

}
