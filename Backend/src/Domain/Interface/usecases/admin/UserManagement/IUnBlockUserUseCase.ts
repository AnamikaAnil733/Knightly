import { UnBlockUserInputDTO,UnBlockUserOutputDTO } from "../../../../DTOs/adminDTOs";

export interface IUnBlockUserUseCase{
    unblockUser(input:UnBlockUserInputDTO):Promise<UnBlockUserOutputDTO>
}
