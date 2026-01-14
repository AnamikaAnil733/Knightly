import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/UserManagmentRepository";
import { IUnBlockUserUseCase } from "../../../../Domain/Interface/usecases/admin/IUnBlockUserUseCase";
import { UnBlockUserInputDTO,UnBlockUserOutputDTO } from "../../../DTOs/adminDTOs";


export class UnBlockUserUseCase implements IUnBlockUserUseCase{
    private _UserManagmentRepository:IUserManagmentRepository
    constructor(UserManagmentRepository:IUserManagmentRepository){
        this._UserManagmentRepository = UserManagmentRepository 
    } 
    async unblockUser(input: UnBlockUserInputDTO): Promise<UnBlockUserOutputDTO> {
        const UnbanUser = await this._UserManagmentRepository.unban(input.userId)
        if(!UnbanUser) throw new Error("User not found with the given ID")

            return {
                success:true,
                message:"User is unblocked Sucessfully"
            }
    }
}