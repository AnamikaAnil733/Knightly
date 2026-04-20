import { IStripeService } from "../../../Domain/Interface/Service/IStripeService";
import { IBaseRepository } from "../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../Domain/Entity/Auth";
import { CustomError } from "../../../Domain/Entity/CustomError";
import ICreateCheckoutSessionUseCase from "../../../Domain/Interface/Usecases/Payment/ICreateCheckoutSessionUseCase";

export default class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
  constructor(
    private stripeService: IStripeService,
    private userRepository: IBaseRepository<EAuth, string>,
  ) {}

  async execute(userId: string): Promise<string> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    if (user.premium) {
      throw new CustomError(400, "User already has a premium subscription");
    }

    const sessionUrl = await this.stripeService.createCheckoutSession(userId, user.email);
    return sessionUrl;
  }
}
