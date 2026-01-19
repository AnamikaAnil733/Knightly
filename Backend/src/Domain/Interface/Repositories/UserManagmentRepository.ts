import EAuth from "../../Entity/auth";
import { IBaseRepository } from "./BaseReository";

export interface IUserManagmentRepository extends IBaseRepository<EAuth,string> {
  getAll(skip:number,limit:number): Promise<EAuth[]>;
  ban(id: string): Promise<boolean>;
  unban(id: string): Promise<boolean>;
  count():Promise<number>
}
