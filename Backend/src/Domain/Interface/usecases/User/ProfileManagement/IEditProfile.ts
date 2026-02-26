import {
  EditProfileinputDto,
  EditProfileoutputDto,
} from "../../../../DTOs/UserDTOs";

export interface IEditProfileUseCase {
  editUser(input: EditProfileinputDto): Promise<EditProfileoutputDto>;
}
