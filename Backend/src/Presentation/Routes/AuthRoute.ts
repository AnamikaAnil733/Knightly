import { Router } from "express";
import { authController } from "../../Infrastructure/Composition/AuthComposition";
import { AUTH_ROUTES } from "../Constants/Routes/AuthRoutes";

export class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(AUTH_ROUTES.SEND_OTP, authController.resendOTP);
    this.router.post(AUTH_ROUTES.VERIFY_OTP, authController.verifyOtp);
    this.router.post(AUTH_ROUTES.REGISTER, authController.register);
    this.router.post(AUTH_ROUTES.LOGIN, authController.login);
    this.router.post(AUTH_ROUTES.RESEND_OTP, authController.resendOTP);
    this.router.post(
      AUTH_ROUTES.FORGET_PASSWORD,
      authController.forgetPassword,
    );
    this.router.post(
      AUTH_ROUTES.VERIFY_FORGET_PASSWORD_OTP,
      authController.verifyOtp,
    );
    this.router.post(AUTH_ROUTES.RESET_PASSWORD, authController.resetPassword);
    this.router.post(AUTH_ROUTES.GOOGLE_AUTH, authController.googleAuth);
    this.router.post(AUTH_ROUTES.REFRESH, authController.refresh);
    this.router.get(AUTH_ROUTES.GET_SETTINGS, authController.getPublicSettings);
  }
}
