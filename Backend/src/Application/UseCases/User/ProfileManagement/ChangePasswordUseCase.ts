import { MESSAGES } from "../../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { IBaseRepository } from "../../../../Domain/Interface/Repositories/IBaseRepository";
import { IChangePasswordUseCase } from "../../../../Domain/Interface/usecases/User/ProfileManagement/IChangePassword";
import {
  ChangePasswordOutputDto,
  ChangePasswordInputDto,
} from "../../../../Domain/DTOs/UserDTOs";
import EAuth from "../../../../Domain/Entity/Auth";
import { IHashService } from "../../../../Domain/Interface/service/IHashpassword";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  private _changePasswordRepo: IBaseRepository<EAuth>;
  private _hashservice: IHashService;
  constructor(
    changePassword: IBaseRepository<EAuth>,
    hashService: IHashService
  ) {
    this._changePasswordRepo = changePassword;
    this._hashservice = hashService;
  }
  async changePassword(
    input: ChangePasswordInputDto
  ): Promise<ChangePasswordOutputDto> {
    try {
      const { userId, currentPassword, newPassword } = input;

      if (!currentPassword || !newPassword) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.ALL_FIELDS_REQUIRED
        );
      }

      if (newPassword.length < 8) {
        throw new CustomError(
          HttpStatusCodes.BAD_REQUEST,
          MESSAGES.PASSWORD_LENGTH
        );
      }

      const user = await this._changePasswordRepo.findById(userId);
      if (!user) {
        throw new CustomError(
          HttpStatusCodes.NOT_FOUND,
          MESSAGES.USER_DOESNT_EXIST
        );
      }

      const verify = await this._hashservice.compare(
        currentPassword,
        user.passwordHash!
      );

      if (!verify) {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.INCORRECT_AUTH_CREDENTIALS
        );
      }
      const hashPassword = await this._hashservice.hash(newPassword);
      user.passwordHash = hashPassword;
      const changePassword = await this._changePasswordRepo.update(user);
      if (!changePassword) {
        throw new CustomError(
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
          MESSAGES.FAILED_UPDATE_PASSWORD
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
