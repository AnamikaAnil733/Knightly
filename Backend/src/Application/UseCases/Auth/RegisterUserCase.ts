import { IUserRepository } from "../../../Domain/Interface/UserRepository";
import  UserEntity  from "../../../Domain/Entity/UserEntity";
import { ICachingService } from "../../../Domain/Interface/service/cachingService";
import { IHashService } from "../../../Domain/Interface/service/hashpassword";
import { UserRole } from "../../../Domain/Types/UserRole";

export class RegisterUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _cachingService: ICachingService,
    private _hashService: IHashService
  ) {}

  async execute(data: {
    displayName: string;
    email: string;
    password?: string;
    googleId?: string;
  }) {
    const verified = await this._cachingService.getData<boolean>(`VERIFIED_USER:${data.email}`);
    if (!verified) throw new Error("Please verify email first.");

    const existingUser = await this._userRepo.findByEmail(data.email);
    if (existingUser) throw new Error("User already exists");

  if (!data.password) {
  throw new Error("Password is required");
}
const hashedPassword = await this._hashService.hash(data.password);


    const newUser = new UserEntity({
      displayName: data.displayName,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER,
      createdAt: new Date(),
    });
    console.log(newUser)

    return await this._userRepo.create(newUser);
  }
}
