import { ChangePasswordInputDto,ChangePasswordOutputDto } from "../../../../DTOs/UserDTOs";


export interface IChangePasswordUseCase{
    changePassword(input:ChangePasswordInputDto):Promise<ChangePasswordOutputDto>
}
