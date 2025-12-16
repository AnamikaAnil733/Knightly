import { Router } from "express";
import { authController } from "../../Infrastructure/Composition/AuthComposition";

export class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/send-otp", authController.resendOTP);
    this.router.post("/verify-otp", authController.verifyOtp);
    this.router.post("/register", authController.register);
    this.router.post("/login", authController.login);
    this.router.post("/resend-otp", authController.resendOTP);
    this.router.post("/forget-password", authController.forgetPassword);
    this.router.post("/verify-forgetpasswordOTP",authController.verifyOtp );
    this.router.post("/reset-password", authController.resetPassword);
    this.router.post("/googleAuth",authController.googleAuth)
  }
}
