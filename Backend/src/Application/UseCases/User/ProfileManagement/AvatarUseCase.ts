import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IGetAvatarUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IGetAvatarUseCase";
import { GetAvatarInputDto,GetAvatarOutputDto } from "../../../../Domain/DTOs/UserDTOs";
import { IStorageService} from "../../../../Domain/Interface/Service/IS3Service";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";



export class GetAvatarUrlUseCase implements IGetAvatarUseCase{
  constructor( private readonly _storageService :IStorageService){}

  async execute(input: GetAvatarInputDto): Promise<GetAvatarOutputDto> {
    const {userId,contentType} = input;
    if(!contentType.startsWith("image/")){
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.ONLY_IMAGE_FILES,
      );
    }
    const key = `avatars/${userId}/${Date.now()}`;
    return this._storageService.generateAvatarUploadUrl(key,contentType);

  }
}
