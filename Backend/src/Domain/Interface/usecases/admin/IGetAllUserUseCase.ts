import { GetAllUsersOutputDTO } from "../../../DTOs/adminDTOs";

export interface IGetAllUserUseCase{
    getAllUsers(page:number,limit:number):Promise<GetAllUsersOutputDTO|null>;
}
