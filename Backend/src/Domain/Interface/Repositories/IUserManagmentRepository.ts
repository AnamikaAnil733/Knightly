import EAuth from "../../Entity/Auth";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserManagmentRepository
  extends IBaseRepository<EAuth, string> {
  getAll(
    skip: number,
    limit: number,
    search?: string,
    filter?: string
  ): Promise<EAuth[]>;
  ban(id: string): Promise<boolean>;
  unban(id: string): Promise<boolean>;
  count(search?: string, filter?: string): Promise<number>;
}
