import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";
import { UserRole } from "../../../Domain/Types/UserRole";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import { ICachingService } from "../../../Domain/Interface/service/cachingService";
import { IHashService } from "../../../Domain/Interface/service/hashpassword";
import { IResetPasswordUseCase } from "../../../Domain/Interface/usecases/authentication/IResetPasswordUseCase";


export class ResetPaswordUseCase implements IResetPasswordUseCase{
    constructor(
        private _cachingService: ICachingService,
        private _hashService: IHashService,
        private _authRepository: IUserRepository
    ){}

    async execute(password: string, email: string): Promise<UserRole> {
        
        // Use reset password verification key, not registration key
        const verified = await this._cachingService.getData<boolean>(`VERIFIED_USER:${email}`);
        console.log(verified)

        if (!verified) {
            throw new CustomError(
                HttpStatusCodes.UNAUTHORIZED,
                MESSAGES.EMAIL_VALIDATION_EXPIRED
            );
        }

        const user = await this._authRepository.findByEmail(email);
        console.log(user)

        if (!user) {
            throw new CustomError(
                HttpStatusCodes.NOT_FOUND,
                MESSAGES.USER_DOESNT_EXIST
            );
        }

        const passwordHash = await this._hashService.hash(password);

        user.passwordHash = passwordHash;

        await this._authRepository.update(user);

        return user.role;
    }
}