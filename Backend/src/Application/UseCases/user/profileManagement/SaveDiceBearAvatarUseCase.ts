import { IStorageService } from "../../../../Domain/Interface/service/S3Service";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseReository";
import EAuth from "../../../../Domain/Entity/auth";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";

export class SaveDiceBearAvatarUseCase {
  constructor(
    private readonly storageService: IStorageService,
    private readonly userRepo: IBaseRepository<EAuth>
  ) {}

  async execute({
    userId,
    diceBearUrl,
  }: {
    userId: string;
    diceBearUrl: string;
  }): Promise<string> {

console.log(diceBearUrl)
    if (!diceBearUrl.startsWith("https://api.dicebear.com/")) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        "Invalid avatar source"
      );
    }

    // ✅ Native fetch (Node 18+)
    const response = await fetch(diceBearUrl);
    console.log(response,"Saveeeee")

    if (!response.ok) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        "Failed to fetch avatar from DiceBear"
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const svgBuffer = Buffer.from(arrayBuffer);

    const avatarUrl = await this.storageService.uploadObject({
      key: `avatars/${userId}/avatar.svg`,
      body: svgBuffer,
      contentType: "image/svg+xml",
    });
    console.log(avatarUrl,"heyyyyy")

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "User not found"
      );
    }
   

    user.avatarKey = avatarUrl;
    console.log(user)
    await this.userRepo.update(user);

    return avatarUrl;
  }
}
