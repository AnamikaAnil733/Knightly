import { NextFunction, Request, Response } from "express";
import ICreateCheckoutSessionUseCase from "../../../Domain/Interface/Usecases/Payment/ICreateCheckoutSessionUseCase";
import IStripeWebhookUseCase from "../../../Domain/Interface/Usecases/Payment/IStripeWebhookUseCase";
import IVerifySessionUseCase from "../../../Domain/Interface/Usecases/Payment/IVerifySessionUseCase";

export default class PaymentController {
  constructor(
    private _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
    private _stripeWebhookUseCase: IStripeWebhookUseCase,
    private _verifySessionUseCase: IVerifySessionUseCase,
  ) {}

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const url = await this._createCheckoutSessionUseCase.execute(userId);
      res.status(200).json({ url });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    const payload = (req as any).rawBody;

    try {
      await this._stripeWebhookUseCase.execute(payload, sig);
      res.status(200).send({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  async verifySession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      const { sessionId } = req.body;

      const result = await this._verifySessionUseCase.execute(sessionId, userId);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  }
}
