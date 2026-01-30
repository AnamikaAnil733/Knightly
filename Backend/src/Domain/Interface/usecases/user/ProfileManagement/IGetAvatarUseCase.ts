import { GetAvatarInputDto,GetAvatarOutputDto} from "../../../../DTOs/userDTOs"

export interface IGetAvatarUseCase{
    execute(
        input:GetAvatarInputDto
    ):Promise<GetAvatarOutputDto>
}