import { GetAllUsersOutputDTO } from "../../../../DTOs/adminDTOs";

export interface IGetAllUserUseCase{
    getAllUsers(page:number,limit:number,search:string,filter:string):Promise<GetAllUsersOutputDTO|null>;
}
