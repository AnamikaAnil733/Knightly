import EAuth from "../../../Entity/auth";

export interface IRegisterUserUseCase {
  execute(data: {
    displayname: string;
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<EAuth>;
}
