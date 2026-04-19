import { IReportRepository } from "../../../../Domain/Interface/Repositories/IReportRepository";
import { IGetReportsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Report/IGetReportsUseCase";
import { ReportStatus } from "../../../../Domain/Types/ReportTypes";
import ReportEntity from "../../../../Domain/Entity/ReportEntity";

export class GetReportsUseCase implements IGetReportsUseCase {
  constructor(private readonly _reportRepo: IReportRepository) {}

  async execute(params: {
    page: number;
    limit: number;
    status?: ReportStatus;
  }): Promise<{ reports: ReportEntity[]; total: number }> {
    return await this._reportRepo.findAll(params.page, params.limit, params.status);
  }
}
