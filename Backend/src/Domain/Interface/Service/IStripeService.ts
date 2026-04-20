export interface IStripeService {
  createCheckoutSession(userId: string, userEmail: string): Promise<string>;
  retrieveCheckoutSession(sessionId: string): Promise<{
    paymentStatus: string;
    clientReferenceId: string | null;
    subscriptionId: string | null;
    customerId: string | null;
  }>;
}
