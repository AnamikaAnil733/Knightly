import  EAuth from "../../../../Domain/Entity/auth";
import { IUserManagmentRepository } from "../../../../Domain/Interface/Repositories/UserManagmentRepository";
import { IGetAllUserUseCase } from "../../../../Domain/Interface/usecases/admin/UserManagement/IGetAllUserUseCase";
import { GetAllUsersInputDto,GetAllUsersOutputDTO } from "../../../../Domain/DTOs/adminDTOs";

export class GetAllUserUseCase implements IGetAllUserUseCase {
  constructor(
    private readonly _userManagmentRepository: IUserManagmentRepository,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
    search?:string,
    filter?:string,
  ): Promise<GetAllUsersOutputDTO> {

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this._userManagmentRepository.getAll(skip, limit,search,filter),
      this._userManagmentRepository.count(search,filter),
    ]);



    return {
      users: users.map(user => ({
        id: user.id!,
        displayname: user.displayname,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        isNewUser: user.isNewUser,
        createdAt: user.createdAt,
        gamesPlayed: user.gamesPlayed,
        premium: user.premium,
        rating: user.rating.getAll(),
        gamesWin: user.gamesWin,
        longestStreak: user.longestStreak,
        currentStreak: user.currentStreak,
        achievements: user.achievements,
        rewards: user.rewards,
        avatarUrl:user.avatarKey,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
