import ReportEntity from "../../Entity/ReportEntity";
import { IBaseRepository } from "./IBaseRepository";

export interface IReportRepository extends IBaseRepository<ReportEntity, string> {
  findAll(page: number, limit: number, status?: string): Promise<{ reports: ReportEntity[], total: number }>;
}
