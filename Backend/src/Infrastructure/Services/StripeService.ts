import Stripe from "stripe";
import { IStripeService } from "../../Domain/Interface/Service/IStripeService";

export default class StripeService implements IStripeService {
  private stripe: any;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-12-18.acacia",
    } as any);
  }

  async createCheckoutSession(userId: string, userEmail: string): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId,
      success_url: `${process.env.ORIGIN_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ORIGIN_URL}/payment/cancel`,
      metadata: {
        userId,
      },
    });

    return session.url!;
  }

  async handleWebhook(sig: string, payload: any): Promise<void> {
    // This will be implemented in the UseCase to maintain Clean Architecture
    // But the service might need helper methods to verify signatures
  }

  public constructEvent(payload: string | Buffer, sig: string, secret: string): any {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }

  async retrieveCheckoutSession(sessionId: string): Promise<{
    paymentStatus: string;
    clientReferenceId: string | null;
    subscriptionId: string | null;
    customerId: string | null;
  }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      paymentStatus: session.payment_status,
      clientReferenceId: session.client_reference_id ?? null,
      subscriptionId: (session.subscription as string) ?? null,
      customerId: (session.customer as string) ?? null,
    };
  }
}
