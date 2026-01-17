import { updateAvatarInputDto } from "../../../DTOs/userDTOs";


export interface IUpdateAvatarUseCase{
    exexute(input:updateAvatarInputDto):Promise<void>
}