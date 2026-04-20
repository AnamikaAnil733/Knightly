import { IUserRepository } from "../../../Domain/Interface/Repositories/IUserRepository";
import ETransaction from "../../../Domain/Entity/Transaction";
import { ITransactionRepository } from "../../../Domain/Interface/Repositories/ITransactionRepository";
import StripeService from "../../../Infrastructure/Services/StripeService";
import IStripeWebhookUseCase from "../../../Domain/Interface/Usecases/Payment/IStripeWebhookUseCase";

export default class StripeWebhookUseCase implements IStripeWebhookUseCase {
  constructor(
    private stripeService: StripeService,
    private userRepository: IUserRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(payload: any, sig: string): Promise<void> {
    let event: any;

    try {
      event = this.stripeService.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || "",
      );
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as any;
        await this.handleSubscriptionCreated(session);
        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object as any;
        await this.handleSubscriptionDeleted(subscription);
        break;
      // Handle other event types as needed
    }
  }

  private async handleSubscriptionCreated(session: any) {
    const userId = session.client_reference_id || session.metadata?.userId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (!userId) {
      console.error("Webhook Error: client_reference_id and metadata.userId are missing in session", session.id);
      return;
    }

    try {
      const user = await this.userRepository.findById(userId);
      if (user) {
        user.updatePremiumStatus(true, subscriptionId, customerId);
        await this.userRepository.update(user);

        // Record the transaction
        const transaction = new ETransaction({
          userId,
          amount: (session.amount_total || 0) / 100, // Convert from cents
          currency: session.currency || "usd",
          status: "COMPLETED",
          stripeSessionId: session.id,
          stripeSubscriptionId: subscriptionId,
          type: "SUBSCRIPTION",
        });

        try {
          await this.transactionRepository.create(transaction);
        } catch (error: any) {
          if (error.code === 11000) {
            console.log("Transaction already recorded for session:", session.id);
          } else {
            console.error("Error creating transaction in webhook:", error.message);
            throw error;
          }
        }
      } else {
        console.error("Webhook Error: User not found for ID:", userId);
      }
    } catch (error: any) {
      console.error("Webhook Error in handleSubscriptionCreated:", error.message);
      throw error;
    }
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer as string;

    try {
      const user = await this.userRepository.findByStripeCustomerId(customerId);
      if (user) {
        user.updatePremiumStatus(false);
        await this.userRepository.update(user);
        console.log(`Premium status revoked for user: ${user.email} (Stripe Customer: ${customerId})`);
      } else {
        console.error("Webhook Error: User not found for Stripe Customer ID:", customerId);
      }
    } catch (error: any) {
      console.error("Webhook Error in handleSubscriptionDeleted:", error.message);
      throw error;
    }
  }
}
