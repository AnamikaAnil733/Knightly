import { GetAvatarInputDto,GetAvatarOutputDto,    } from "../../../DTOs/userDTOs"

export interface IgetAvatarUseCase{
    execute(
        input:GetAvatarInputDto
    ):Promise<GetAvatarOutputDto>
}