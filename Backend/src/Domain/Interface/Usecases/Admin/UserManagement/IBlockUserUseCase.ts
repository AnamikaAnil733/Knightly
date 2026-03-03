import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../../DTOs/AdminDTOs";



export interface IBlockUserUseCase{
    blockUser(input:BlockUserInputDTO):Promise<BlockUserOutputDTO>
}