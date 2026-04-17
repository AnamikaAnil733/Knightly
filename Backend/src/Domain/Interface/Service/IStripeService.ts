export interface IStripeService {
  createCheckoutSession(userId: string, userEmail: string): Promise<string>;
  handleWebhook(sig: string, payload: any): Promise<void>;
  retrieveCheckoutSession(sessionId: string): Promise<{
    paymentStatus: string;
    clientReferenceId: string | null;
    subscriptionId: string | null;
    customerId: string | null;
  }>;
}
