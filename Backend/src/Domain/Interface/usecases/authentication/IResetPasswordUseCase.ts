import { UserRole } from "../../../Types/UserRole";

export interface IResetPasswordUseCase{
    execute(password:string,email:string):Promise<UserRole>;
}