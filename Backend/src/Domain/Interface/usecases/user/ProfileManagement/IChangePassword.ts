import { ChangePasswordInputDto,ChangePasswordOutputDto } from "../../../../DTOs/userDTOs";


export interface IChangePasswordUseCase{
    changePassword(input:ChangePasswordInputDto):Promise<ChangePasswordOutputDto>
}