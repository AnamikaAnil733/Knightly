import EAuth from "../../Entity/Auth";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<EAuth, string> {
  findByEmail(email: string): Promise<EAuth | null>;
}
