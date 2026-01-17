import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/statusCode";
import { updateAvatarInputDto } from "../../../../Domain/DTOs/userDTOs";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/BaseReository";
import EAuth from "../../../../Domain/Entity/auth";
import { IUpdateAvatarUseCase } from "../../../../Domain/Interface/usecases/user/IUpdateAvatarUseCase";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";



export class updateAvatarUseCase implements IUpdateAvatarUseCase{
    constructor(private readonly userRepo:IBaseRepository<EAuth>
    ){}

    async execute(input: updateAvatarInputDto): Promise<void> {
        const {userId,avatarUrl} = input
     
        if(!avatarUrl){
            throw new CustomError(
                HttpStatusCodes.BAD_REQUEST,
                "Avatar URL is Required"
            )
        }

        const user = await this.userRepo.findById(userId)
        if(!user){
            throw new CustomError(
                HttpStatusCodes.NOT_FOUND,
                MESSAGES.USER_DOESNT_EXIST
            )
        }

        user.avatarUrl = avatarUrl
        await this.userRepo.update(user)

    }
}