export interface IStripeService {
  createCheckoutSession(userId: string, userEmail: string): Promise<string>;
  handleWebhook(sig: string, payload: any): Promise<void>;
}
