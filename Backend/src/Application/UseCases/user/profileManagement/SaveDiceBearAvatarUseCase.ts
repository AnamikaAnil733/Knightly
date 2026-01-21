import { IStorageService } from "../../../../Domain/Interface/service/S3Service";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseReository";
import EAuth from "../../../../Domain/Entity/auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

export class SaveDiceBearAvatarUseCase {
  constructor(
    private readonly _storageService: IStorageService,
    private readonly _userRepo: IBaseRepository<EAuth>
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
        "Invalid avatar source"
      );
    }

    const response = await fetch(diceBearUrl);

    if (!response.ok) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        "Failed to fetch avatar from DiceBear"
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
        "User not found"
      );
    }
   

    user.avatarKey = avatarUrl;
    await this._userRepo.update(user);

    return avatarUrl;
  }
}
