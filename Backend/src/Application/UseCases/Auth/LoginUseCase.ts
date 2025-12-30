import { AuthRequestDTO,AuthResponseDTO } from "../../DTOs/authDTO";
import { IUserRepository } from "../../../Domain/Interface/Repositories/UserRepository";
import { IHashService } from "../../../Domain/Interface/service/hashpassword";
import { ILoginUseCase } from "../../../Domain/Interface/usecases/authentication/ILoginUseCases";
import { CustomError } from "../../../Domain/Entity/CustomError";
import { MESSAGES } from "../../../Domain/Constants/Messages/Messages";
import { AuthMapper } from "../../mapper/AuthMapper";
import { HttpStatusCodes } from "../../../Domain/Types/statusCode";
import { ITokenService } from "../../../Domain/Interface/service/ITokenService";

export class LoginUseCase implements ILoginUseCase{
    constructor(
    private _authRepository:IUserRepository,
    private _hashservice:IHashService,
    private _tokenservice:ITokenService,
    ){}

    async execute(data: AuthRequestDTO): Promise<AuthResponseDTO> {
        const {email,password} = data;
        const user = await this._authRepository.findByEmail(email);
        if(!user?.passwordHash){
            throw new CustomError(
                HttpStatusCodes.UNAUTHORIZED,
                MESSAGES.INCORRECT_AUTH_CREDENTIALS
            )
        }
        if(user && !user.isBlocked){

            const verified = await this._hashservice.compare(
                password!,
                user.passwordHash
            )
            const accessToken = this._tokenservice.generateAccessToken({
                userId: user.id!,
                role: user.role
            });
            if(verified){
                return AuthMapper.toAuthResponseDTOfromEntity(user,accessToken)
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
