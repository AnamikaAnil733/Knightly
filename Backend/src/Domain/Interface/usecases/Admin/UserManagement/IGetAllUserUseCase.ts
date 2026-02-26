import { GetAllUsersOutputDTO } from "../../../../DTOs/AdminDTOs";

export interface IGetAllUserUseCase {
  getAllUsers(
    page: number,
    limit: number,
    search: string,
    filter: string
  ): Promise<GetAllUsersOutputDTO | null>;
}
