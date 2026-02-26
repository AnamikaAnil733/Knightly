import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../../../Domain/Entity/Auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class SaveDiceBearAvatarUseCase {
  constructor(
    private readonly _storageService: IStorageService,
    private readonly _userRepo: IBaseRepository<EAuth>,
  ) {}

  async execute({
    userId,
    diceBearUrl,
  }: {
    userId: string;
    diceBearUrl: string;
  }): Promise<string> {


    if (!diceBearUrl.startsWith("https://api.dicebear.com/")) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_SOURCE,
      );
    }

    const response = await fetch(diceBearUrl);

    if (!response.ok) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.FAILED_FETCH_AVATAR_DICEBEAR,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const svgBuffer = Buffer.from(arrayBuffer);

    const avatarUrl = await this._storageService.uploadObject({
      key: `avatars/${userId}/avatar.svg`,
      body: svgBuffer,
      contentType: "image/svg+xml",
    });


    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DOESNT_EXIST,
      );
    }


    user.avatarKey = avatarUrl;
    await this._userRepo.update(user);

    return avatarUrl;
  }
}
