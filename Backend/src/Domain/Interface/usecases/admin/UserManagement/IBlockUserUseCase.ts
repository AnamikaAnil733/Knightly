import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../../DTOs/adminDTOs";



export interface IBlockUserUseCase{
    blockUser(input:BlockUserInputDTO):Promise<BlockUserOutputDTO>
}
