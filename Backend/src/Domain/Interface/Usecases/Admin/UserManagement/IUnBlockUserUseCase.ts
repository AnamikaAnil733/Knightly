import { UnBlockUserInputDTO,UnBlockUserOutputDTO } from "../../../../DTOs/AdminDTOs";

export interface IUnBlockUserUseCase{
    unblockUser(input:UnBlockUserInputDTO):Promise<UnBlockUserOutputDTO>
}