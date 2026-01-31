import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { IGetAvatarUseCase } from "../../../../Domain/Interface/usecases/user/ProfileManagement/IGetAvatarUseCase";
import { GetAvatarInputDto,GetAvatarOutputDto } from "../../../../Domain/DTOs/userDTOs";
import { IStorageService} from "../../../../Domain/Interface/service/S3Service";



export class GetAvatarUrlUseCase implements IGetAvatarUseCase{
    constructor( private readonly _storageService :IStorageService){}

    async execute(input: GetAvatarInputDto): Promise<GetAvatarOutputDto> {
        const {userId,contentType} = input;
        if(!contentType.startsWith("image/")){
            throw new CustomError(
                HttpStatusCodes.BAD_REQUEST,
                "only image files are allowed"
            )
        }
    const key = `avatars/${userId}/${Date.now()}`;
return this._storageService.generateAvatarUploadUrl(key,contentType)

    }
}