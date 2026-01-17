import { updateAvatarInputDto } from "../../../DTOs/userDTOs";


export interface IUpdateAvatarUseCase{
    execute(input:updateAvatarInputDto):Promise<void>
}