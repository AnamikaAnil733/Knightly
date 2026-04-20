export default interface ICreateCheckoutSessionUseCase {
  execute(userId: string): Promise<string>;
}
