import ReportEntity from "../../../../Entity/ReportEntity";
import { ReportStatus } from "../../../../Types/ReportTypes";

export interface IGetReportsUseCase {
  execute(params: {
    page: number;
    limit: number;
    status?: ReportStatus;
  }): Promise<{ reports: ReportEntity[]; total: number }>;
}
