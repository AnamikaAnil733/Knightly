import { GetAllUsersOutputDTO } from "../../../DTOs/DTOs/adminDTOs";

export interface IGetAllUserUseCase{
    getAllUsers():Promise<GetAllUsersOutputDTO|null>;
}
