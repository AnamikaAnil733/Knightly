import { EditProfileinputDto,EditProfileoutputDto } from "../../../DTOs/userDTOs";


export interface IEditProfileUseCase{
    editUser(input:EditProfileinputDto):Promise<EditProfileoutputDto>
}
