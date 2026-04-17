import { Request, Response } from "express";
import CreateCheckoutSessionUseCase from "../../../Application/UseCases/Payment/CreateCheckoutSessionUseCase";
import StripeWebhookUseCase from "../../../Application/UseCases/Payment/StripeWebhookUseCase";

export default class PaymentController {
  constructor(
    private createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
    private stripeWebhookUseCase: StripeWebhookUseCase
  ) {}

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const url = await this.createCheckoutSessionUseCase.execute(userId);
      res.status(200).json({ url });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    const payload = (req as any).rawBody;

    try {
      await this.stripeWebhookUseCase.execute(payload, sig);
      res.status(200).send({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
