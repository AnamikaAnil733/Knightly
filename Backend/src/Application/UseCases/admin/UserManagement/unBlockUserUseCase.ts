import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/UserManagmentRepository";
import { IUnBlockUserUseCase } from "../../../../Domain/Interface/usecases/admin/UserManagement/IUnBlockUserUseCase";
import { UnBlockUserInputDTO,UnBlockUserOutputDTO } from "../../../../Domain/DTOs/adminDTOs";
import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";


export class UnBlockUserUseCase implements IUnBlockUserUseCase{
  private _UserManagmentRepository:IUserManagmentRepository;
  constructor(UserManagmentRepository:IUserManagmentRepository){
    this._UserManagmentRepository = UserManagmentRepository;
  }
  async unblockUser(input: UnBlockUserInputDTO): Promise<UnBlockUserOutputDTO> {
    const UnbanUser = await this._UserManagmentRepository.unban(input.userId);
    if(!UnbanUser) throw new Error(MESSAGES.USER_DOESNT_EXIST);

    return {
      success:true,
      message:"User is unblocked Sucessfully",
    };
  }
}





















































































































































