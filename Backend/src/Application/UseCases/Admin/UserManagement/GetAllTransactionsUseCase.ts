import { ITransactionRepository } from "../../../../Domain/Interface/Repositories/ITransactionRepository";
import ETransaction from "../../../../Domain/Entity/Transaction";
import IGetAllTransactionsUseCase from "../../../../Domain/Interface/Usecases/Admin/UserManagement/IGetAllTransactionsUseCase";

export default class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(page: number, limit: number): Promise<{ transactions: ETransaction[]; total: number }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.transactionRepository.getAll(skip, limit),
      this.transactionRepository.count(),
    ]);

    return { transactions, total };
  }
}
