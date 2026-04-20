import ETransaction from "../../../../Entity/Transaction";

export default interface IGetAllTransactionsUseCase {
  execute(page: number, limit: number): Promise<{ transactions: ETransaction[]; total: number }>;
}
