import { IReportRepository } from "../../../../Domain/Interface/Repositories/IReportRepository";
import { IUpdateReportStatusUseCase } from "../../../../Domain/Interface/Usecases/Admin/Report/IUpdateReportStatusUseCase";
import { ReportStatus } from "../../../../Domain/Types/ReportTypes";

export class UpdateReportStatusUseCase implements IUpdateReportStatusUseCase {
  constructor(private readonly _reportRepo: IReportRepository) {}

  async execute(reportId: string, status: ReportStatus): Promise<void> {
    const report = await this._reportRepo.findById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }

    report.status = status;
    await this._reportRepo.update(report);
  }
}
