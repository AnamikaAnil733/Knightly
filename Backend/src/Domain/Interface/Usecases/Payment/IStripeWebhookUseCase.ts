export default interface IStripeWebhookUseCase {
  execute(payload: any, sig: string): Promise<void>;
};;;;;;;;;;
