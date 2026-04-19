import { ReportReason } from "../../../../Types/ReportTypes";

export interface ICreateReportUseCase {
  execute(params: {
    reporterId: string;
    reportedId: string;
    reason: ReportReason;
    description: string;
    evidence?: any;
  }): Promise<void>;
}
