import { AuthResponseDTO } from "../../../DTOs/AuthDTO";

export interface IRegisterUserUseCase {
  execute(data: {
    displayname: string;
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<AuthResponseDTO>;
}
