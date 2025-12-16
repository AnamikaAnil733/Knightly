import { AuthRequestDTO,AuthResponseDTO } from "../../DTOs/authDTO";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import { IHashService } from "../../../Domain/Interface/service/hashpassword";
import { ILoginUseCase } from "../../../Domain/Interface/usecases/authentication/ILoginUseCases";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { AuthMapper } from "../../mapper/AuthMapper";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";

export class LoginUseCase implements ILoginUseCase{
    constructor(
    private _authRepository:IUserRepository,
    private _hashservice:IHashService,
    ){}

    async execute(data: AuthRequestDTO): Promise<AuthResponseDTO> {
        const {email,role,password} = data;
        const user = await this._authRepository.findByEmail(email);
        if(!user?.passwordHash){
            throw new CustomError(
                HttpStatusCodes.UNAUTHORIZED,
                MESSAGES.INCORRECT_AUTH_CREDENTIALS
            )
        }
        if(user && !user.isBlocked && user.role === role){

            const verified = await this._hashservice.compare(
                password!,
                user.passwordHash
            )
            if(verified){
                return AuthMapper.toAuthResponseDTOfromEntity(user)
            }else{
                throw new CustomError(
                    HttpStatusCodes.UNAUTHORIZED,
                    MESSAGES.INCORRECT_AUTH_CREDENTIALS
                )
            }
        }else{
            throw new CustomError(
                HttpStatusCodes.UNAUTHORIZED,
                MESSAGES.INCORRECT_AUTH_CREDENTIALS
            )
        }    
    }
}
