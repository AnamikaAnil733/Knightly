import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import EAuth from "../../../Domain/Entity/auth";
import { ICachingService } from "../../../Domain/Interface/service/cachingService";
import { IHashService } from "../../../Domain/Interface/service/hashpassword";
import { UserRole } from "../../../Domain/Types/UserRole";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { IRegisterUserUseCase } from "../../../Domain/Interface/usecases/authentication/IRegisterUseCase";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";

export class RegisterUserUseCase implements IRegisterUserUseCase{
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


    const verified = await this._cachingService.getData<boolean>(`VERIFIED_USER:${data.email}`);
    if (!verified) throw new Error("Please verify email first.");

    const existingUser = await this._userRepo.findByEmail(data.email);
    if (existingUser) throw new Error("User already exists");

    let hashedPassword: string | undefined = undefined;

    if (!data.googleId) {
      if (!data.password) {
        throw new Error("Password is required for email registration.");
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
      updatedAt: new Date()
    });

  
    return await this._userRepo.create(newUser);
  }
}
