import EAuth from "../../Entity/auth";
import { IBaseRepository } from "./BaseRepository";

export interface IUserRepository extends IBaseRepository<EAuth,string>{
  findByEmail(email: string): Promise<EAuth | null>;
}






