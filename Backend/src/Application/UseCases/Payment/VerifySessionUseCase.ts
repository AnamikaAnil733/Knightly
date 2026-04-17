import { IStripeService } from "../../../Domain/Interface/Service/IStripeService";
import { IBaseRepository } from "../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../Domain/Entity/Auth";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/StatusCode";

export default class VerifySessionUseCase {
  constructor(
    private stripeService: IStripeService,
    private userRepository: IBaseRepository<EAuth, string>
  ) {}

  async execute(sessionId: string, userId: string): Promise<{ premium: boolean }> {
    if (!sessionId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, "Session ID is required");
    }

    const session = await this.stripeService.retrieveCheckoutSession(sessionId);

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

    return { premium: true };
  }
}
