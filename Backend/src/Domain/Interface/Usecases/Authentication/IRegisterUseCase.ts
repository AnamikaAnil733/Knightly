import EAuth from "../../../Entity/Auth";

export interface IRegisterUserUseCase {
  execute(data: {
    displayname: string;
    email: string;
    password?: string;
    googleId?: string;
  }): Promise<EAuth>;
}
