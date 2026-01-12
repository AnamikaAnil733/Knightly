import { UnBlockUserInputDTO,UnBlockUserOutputDTO } from "../../../../Application/DTOs/adminDTOs";

export interface IUnBlockUserUseCase{
    unblockUser(input:UnBlockUserInputDTO):Promise<UnBlockUserOutputDTO>
}