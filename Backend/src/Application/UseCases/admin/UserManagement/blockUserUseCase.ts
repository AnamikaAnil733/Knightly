import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/UserManagmentRepository";
import { IBlockUserUseCase } from "../../../../Domain/Interface/usecases/admin/UserManagement/IBlockUserUseCase";
import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../../Domain/DTOs/adminDTOs";



export class BlockUserUseCase implements IBlockUserUseCase{
  private _UserManagmentRepository:IUserManagmentRepository;
  constructor(UserManagmentRepository:IUserManagmentRepository){
    this._UserManagmentRepository = UserManagmentRepository;
  }
  async blockUser(input: BlockUserInputDTO): Promise<BlockUserOutputDTO> {

    const banUser = await this._UserManagmentRepository.ban(input.userId);
    if(!banUser) throw new Error("User not found with the given ID");

    return {
      success:true,
      message:"User is blocked Sucessfully",
    };
  }
}
