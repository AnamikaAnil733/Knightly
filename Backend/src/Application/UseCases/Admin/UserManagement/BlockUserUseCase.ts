import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IBlockUserUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IBlockUserUseCase";
import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../../Domain/DTOs/AdminDTOs";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";



export class BlockUserUseCase implements IBlockUserUseCase{
  private _UserManagmentRepository:IUserManagmentRepository;
  constructor(UserManagmentRepository:IUserManagmentRepository){
    this._UserManagmentRepository = UserManagmentRepository;
  }
  async blockUser(input: BlockUserInputDTO): Promise<BlockUserOutputDTO> {

    const banUser = await this._UserManagmentRepository.ban(input.userId);
    if(!banUser) throw new Error(MESSAGES.USER_DOESNT_EXIST);

    return {
      success:true,
      message:MESSAGES.USER_BLOCKED,
    };
  }
}
