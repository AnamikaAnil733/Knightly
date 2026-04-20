import { IStripeService } from "../../../Domain/Interface/Service/IStripeService";
import { IBaseRepository } from "../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../Domain/Entity/Auth";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/StatusCode";
import { ITransactionRepository } from "../../../Domain/Interface/Repositories/ITransactionRepository";
import ETransaction from "../../../Domain/Entity/Transaction";
import IVerifySessionUseCase from "../../../Domain/Interface/Usecases/Payment/IVerifySessionUseCase";

export default class VerifySessionUseCase implements IVerifySessionUseCase {
  constructor(
    private stripeService: IStripeService,
    private userRepository: IBaseRepository<EAuth, string>,
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(sessionId: string, userId: string): Promise<{ premium: boolean }> {
    if (!sessionId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Session ID is required");
    }

    // Retrieve full session details from Stripe
    const session = await this.stripeService.retrieveCheckoutSession(sessionId);
    const stripeSession = await (this.stripeService as any).stripe.checkout.sessions.retrieve(sessionId);

    // Validate payment was actually paid
    if (session.paymentStatus !== "paid") {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Payment not completed");
    }

    // Validate the session belongs to this user
    if (session.clientReferenceId !== userId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, "Session does not belong to this user");
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, "User not found");
    }

    if (!user.premium) {
      user.updatePremiumStatus(true, session.subscriptionId ?? undefined, session.customerId ?? undefined);
      await this.userRepository.update(user);
    }

    // Fallback: Record the transaction if it hasn't been recorded by the webhook yet
    try {
      const transaction = new ETransaction({
        userId,
        amount: (stripeSession.amount_total || 0) / 100,
        currency: stripeSession.currency || "usd",
        status: "COMPLETED",
        stripeSessionId: sessionId,
        stripeSubscriptionId: session.subscriptionId ?? undefined,
        type: "SUBSCRIPTION",
      });

      await this.transactionRepository.create(transaction);
      console.log("Transaction recorded via fallback (VerifySessionUseCase) for session:", sessionId);
    } catch (error: any) {
      if (error.code === 11000) {
        // Already exists, ignore
        console.log("Transaction already recorded (VerifySessionUseCase) for session:", sessionId);
      } else {
        console.error("Error recording transaction fallback:", error.message);
        // We don't throw here to avoid failing the verification UI if just the log record fails
      }
    }

    return { premium: true };
  }
}
