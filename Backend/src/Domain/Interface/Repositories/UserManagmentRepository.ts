import EAuth from "../../Entity/auth";
import { IBaseRepository } from "./BaseReository"

export interface IUserManagmentRepository extends IBaseRepository<EAuth,string> {
  getAll(): Promise<EAuth[]>;
  ban(id: string): Promise<void>;
  unban(id: string): Promise<void>;
}
