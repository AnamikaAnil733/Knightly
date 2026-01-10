import  EAuth from "../../../Domain/Entity/auth";
import { IUserManagmentRepository } from "../../../Domain/Interface/Repositories/UserManagmentRepository";
import { IGetAllUserUseCase } from "../../../Domain/Interface/usecases/admin/IGetAllUserUseCase";
import { GetAllUsersInputDto,GetAllUsersOutputDTO } from "../../DTOs/adminDTOs";

export class GetAllUserUseCase implements IGetAllUserUseCase {
    constructor(
      private readonly userManagmentRepository: IUserManagmentRepository
    ) {}
  
  async getAllUsers(): Promise<GetAllUsersOutputDTO> {
  const users = await this.userManagmentRepository.getAll();

  return {
    users: users.map(user => ({
      id: user.id!,
      displayname: user.displayname,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      isNewUser: user.isNewUser,
      createdAt: user.createdAt,
      gamesPlayed:user.gamesPlayed,
      premium:user.premium,
      rating:user.rating,
      gamesWin:user.gamesWin,
      longestStreak:user.longestStreak,
      currentStreak:user.currentStreak,
      achievements:user.achievements,
      rewards:user.rewards,

    })),
    total: users.length,
  };
}

  }