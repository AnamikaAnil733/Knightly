import { Request, Response } from "express";
import { SendOtpUseCase } from "../../Application/UseCases/Auth/SendOtpuseCase";
import { VerifyOtpUseCase } from "../../Application/UseCases/Auth/VerifyOtpUsecases";
import { RegisterUserUseCase } from "../../Application/UseCases/Auth/RegisterUserCase";


export class AuthController {
  constructor(
    private sendOtpUseCase: SendOtpUseCase,
    private verifyOtpUseCase: VerifyOtpUseCase,
    private registerUserUseCase: RegisterUserUseCase
  ) {}

  sendOtp = async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body;
      await this.sendOtpUseCase.execute(email, name);
      res.status(200).json({ message: "OTP sent!" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const isValid = await this.verifyOtpUseCase.execute(email, String(otp));
      res.status(200).json({ verified: isValid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.registerUserUseCase.execute(req.body);
      res.status(201).json({ message: "User registered!", user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
