import { IUpdateRatingUseCase } from "Domain/Interface/Usecases/User/GameManagement/IUpdateRatingUseCase";
import { IUserRepository } from "../../../../Domain/Interface/Repositories/IUserRepository";
import { EloCalculator } from "../../../../Domain/Chess/Service/EloRatingCalculator";

export class UpadateRatingUseCase implements IUpdateRatingUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    whiteId: string,
    blackId: string,
    result: "WHITEWIN" | "BLACKWIN" | "DRAW",
    type: "BULLET" | "RAPID" | "BLITZ" | "CLASSICAL"
  ): Promise<void> {
    const white = await this.userRepo.findById(whiteId);
    const black = await this.userRepo.findById(blackId);

    if (!white || !black) {
      throw new Error("user not found");
    }

    const whiteRating = white.getRating(type);
    const blackRating = black.getRating(type);

    let scoreWhite: 0 | 0.5 | 1;

    if (result === "WHITEWIN") scoreWhite = 1;
    else if (result === "BLACKWIN") scoreWhite = 0;
    else scoreWhite = 0.5;

    const { newA, newB } = EloCalculator.calculateNewRating(
      whiteRating,
      blackRating,
      scoreWhite
    );

    white.updateRating(type, newA);
    black.updateRating(type, newB);

    await this.userRepo.update(white);
    await this.userRepo.update(black);
  }
}
