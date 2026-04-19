import { IReportRepository } from "../../../../Domain/Interface/Repositories/IReportRepository";
import { ICreateReportUseCase } from "../../../../Domain/Interface/Usecases/User/Report/ICreateReportUseCase";
import { ReportReason } from "../../../../Domain/Types/ReportTypes";
import ReportEntity from "../../../../Domain/Entity/ReportEntity";

export class CreateReportUseCase implements ICreateReportUseCase {
  constructor(private readonly _reportRepo: IReportRepository) {}

  async execute(params: {
    reporterId: string;
    reportedId: string;
    reason: ReportReason;
    description: string;
    evidence?: any;
  }): Promise<void> {
    const report = new ReportEntity({
      reporterId: params.reporterId,
      reportedId: params.reportedId,
      reason: params.reason,
      description: params.description,
      evidence: params.evidence,
    });

    await this._reportRepo.create(report);
  }
}
