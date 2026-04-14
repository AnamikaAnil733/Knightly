import { IGetCoverUploadUrlUseCase } from "../../../../Domain/Interface/Usecases/User/BlogManagement/IGetCoverUploadUrlUseCase";
import { IStorageService } from "../../../../Domain/Interface/Service/IS3Service";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";

export class GetCoverUploadUrlUseCase implements IGetCoverUploadUrlUseCase {
  constructor(private readonly _storageService: IStorageService) {}

  async execute(input: {
    userId: string;
    contentType: string;
  }): Promise<{ uploadUrl: string; key: string }> {
    const { userId, contentType } = input;

    if (!contentType.startsWith("image/")) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.ONLY_IMAGE_FILES,
      );
    }

    const key = `blogs/covers/${userId}/${Date.now()}`;
    return this._storageService.generateUploadUrl(key, contentType);
  }
}
