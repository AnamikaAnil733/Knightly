import EAuth from "../../Entity/auth";
import { IBaseRepository } from "./BaseReository";

export interface IUserRepository extends IBaseRepository<EAuth,string>{
  findByEmail(email: string): Promise<EAuth | null>;
}


// Domain/Interface/Repositories/IUserRepository.ts




