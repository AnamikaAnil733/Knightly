import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { IEditProfileUseCase } from "../../../../Domain/Interface/Usecases/User/ProfileManagement/IEditProfile";
import {
  EditProfileinputDto,
  EditProfileoutputDto,
} from "../../../../Domain/DTOs/UserDTOs";
import EAuth from "../../../../Domain/Entity/Auth";

export class EditUserUseCase implements IEditProfileUseCase {
  private _updateRepo: IBaseRepository<EAuth>;
  constructor(updateRepo: IBaseRepository<EAuth>) {
    this._updateRepo = updateRepo;
  }
  async editUser(input: EditProfileinputDto): Promise<EditProfileoutputDto> {
    try {
      const { userId, displayname } = input;
      console.log(displayname, "usecase");

      if (!displayname || displayname.trim().length < 3) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.INVALID_USERNAME,
        );
      }

      const user = await this._updateRepo.findById(userId);
      if (!user) {
        throw new CustomError(
          HttpStatusCodes.NOT_FOUND,
          MESSAGES.USER_DOESNT_EXIST,
        );
      }

      user.displayname = displayname.trim();

      const updatedUser = await this._updateRepo.update(user);
      if (!updatedUser) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.FAILED_UPDATE_USERNAME,
        );
      }

      return {
        id: updatedUser.id,
        displayname: updatedUser.displayname,
        email: updatedUser.email,
        role: updatedUser.role,
        isBlocked: updatedUser.isBlocked,
        createdAt: updatedUser.createdAt,
        gamesPlayed: updatedUser.gamesPlayed,
        premium: updatedUser.premium,
        rating: updatedUser.rating.getAll(),
        gamesWin: updatedUser.gamesWin,
        longestStreak: updatedUser.longestStreak,
        currentStreak: updatedUser.currentStreak,
        rewards: updatedUser.rewards,
        achievements: updatedUser.achievements,
      };
    } catch (error) {
      throw error;
    }
  }
}
