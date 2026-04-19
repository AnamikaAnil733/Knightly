import { ReportStatus } from "../../../../Types/ReportTypes";

export interface IUpdateReportStatusUseCase {
  execute(reportId: string, status: ReportStatus): Promise<void>;
}
