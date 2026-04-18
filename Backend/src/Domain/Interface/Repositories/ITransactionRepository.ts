import ETransaction from "../../Entity/Transaction";
import { IBaseRepository } from "./IBaseRepository";

export interface ITransactionRepository extends IBaseRepository<ETransaction, string> {
  getAll(skip: number, limit: number): Promise<ETransaction[]>;
  count(): Promise<number>;
}
