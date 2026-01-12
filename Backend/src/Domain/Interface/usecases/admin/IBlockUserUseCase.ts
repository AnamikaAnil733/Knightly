import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../../Application/DTOs/adminDTOs";



export interface IBlockUserUseCase{
    blockUser(input:BlockUserInputDTO):Promise<BlockUserOutputDTO>
}