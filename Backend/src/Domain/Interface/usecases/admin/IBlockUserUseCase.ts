import { BlockUserInputDTO,BlockUserOutputDTO } from "../../../DTOs/DTOs/adminDTOs";



export interface IBlockUserUseCase{
    blockUser(input:BlockUserInputDTO):Promise<BlockUserOutputDTO>
}
