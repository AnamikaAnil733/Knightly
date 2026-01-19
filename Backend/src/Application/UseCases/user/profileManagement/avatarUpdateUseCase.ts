import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { updateAvatarInputDto } from "../../../../Domain/DTOs/userDTOs";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseReository";
import EAuth from "../../../../Domain/Entity/auth";
import { IUpdateAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IUpdateAvatarUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class UpdateAvatarUseCase implements IUpdateAvatarUseCase {
  constructor(
    private readonly userRepo: IBaseRepository<EAuth>
  ) {}

  async execute(input: updateAvatarInputDto): Promise<void> {
    const { userId, avatarKey } = input;

    if (!avatarKey) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        "Avatar key is required"
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DOESNT_EXIST
      );
    }

    // ✅ Store ONLY the S3 key
    user.avatarKey = avatarKey;

    await this.userRepo.update(user);
  }
}
