import { GetAllUsersOutputDTO } from "../../../../Application/DTOs/adminDTOs";

export interface IGetAllUserUseCase{
    getAllUsers():Promise<GetAllUsersOutputDTO|null>;
}