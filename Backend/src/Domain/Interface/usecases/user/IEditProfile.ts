import { EditProfileinputDto,EditProfileoutputDto } from "../../../../Application/DTOs/userDTOs";


export interface IEditProfileUseCase{
    editUser(input:EditProfileinputDto):Promise<EditProfileoutputDto>
}