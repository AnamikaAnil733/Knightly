import { IUserRepository } from "../../../Domain/Interface/Repositories/IUserRepository";
import EAuth from "../../../Domain/Entity/Auth";
import { ICachingService } from "../../../Domain/Interface/service/ICachingService";
import { IHashService } from "../../../Domain/Interface/service/IHashpassword";
import { UserRole } from "../../../Domain/Types/UserRole";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { IRegisterUserUseCase } from "../../../Domain/Interface/usecases/Authentication/IRegisterUseCase";
import { HttpStatusCodes } from "../../../Domain/Types/StatusCode";

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _cachingService: ICachingService,
    private _hashService: IHashService
  ) {}

  async execute(data: {
    displayname: string;
    email: string;
    password?: string;
    googleId?: string;
  }) {
    const verified = await this._cachingService.getData<boolean>(
      `VERIFIED_USER:${data.email}`
    );
    if (!verified) throw new Error(MESSAGES.EMAIL_VERIFY);

    const existingUser = await this._userRepo.findByEmail(data.email);
    if (existingUser) throw new Error(MESSAGES.USER_ALREADY_EXISTS);

    let hashedPassword: string | undefined = undefined;

    if (!data.googleId) {
      if (!data.password) {
        throw new Error(MESSAGES.PASSWORD_AND_EMAIL_REQUIRED);
      }
      hashedPassword = await this._hashService.hash(data.password);
    }
    const newUser = new EAuth({
      displayname: data.displayname,
      email: data.email,
      passwordHash: hashedPassword,
      googleId: data.googleId,
      role: UserRole.USER,
      isBlocked: false,
      isNewUser: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this._userRepo.create(newUser);
  }
}
