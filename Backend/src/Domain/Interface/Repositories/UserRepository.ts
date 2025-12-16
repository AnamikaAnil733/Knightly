import EAuth from "../../Entity/auth";
import { IBaseRepository } from "./BaseReository";

export interface IUserRepository extends IBaseRepository<EAuth,string>{
  // create(user: EAuth): Promise<EAuth>;
  findByEmail(email: string): Promise<EAuth | null>;
  // findById(id: string): Promise<EAuth | null>;
  // update(user:EAuth): Promise<EAuth | null>; 
  // delete(id: string): Promise<boolean>; // OR Promise<void>
}


// Domain/Interface/Repositories/IUserRepository.ts




