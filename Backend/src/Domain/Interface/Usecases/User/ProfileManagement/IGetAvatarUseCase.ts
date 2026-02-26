import { GetAvatarInputDto,GetAvatarOutputDto} from "../../../../DTOs/UserDTOs";

export interface IGetAvatarUseCase{
    execute(
        input:GetAvatarInputDto
    ):Promise<GetAvatarOutputDto>
}
