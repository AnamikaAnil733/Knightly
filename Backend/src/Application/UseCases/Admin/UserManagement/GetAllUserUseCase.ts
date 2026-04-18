import EAuth from "../../../../Domain/Entity/Auth";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/IUserManagementRepository";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetAllUserUseCase";
import {
  GetAllUsersInputDto,
  GetAllUsersOutputDTO,
} from "../../../../Domain/DTOs/AdminDTOs";
import { UserMapper } from "../../../Mapper/UserManagementMapper";

export class GetAllUserUseCase implements IGetAllUserUseCase {
  constructor(
    private readonly _userManagmentRepository: IUserManagmentRepository,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
    search?: string,
    filter?: "ALL" | "BLOCKED" | "UNBLOCKED" | "PREMIUM",
  ): Promise<GetAllUsersOutputDTO> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this._userManagmentRepository.getAll(skip, limit, search, filter),
      this._userManagmentRepository.count(search, filter),
    ]);

    return {
      users: users.map(UserMapper.toBaseUserResponseDTO),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
