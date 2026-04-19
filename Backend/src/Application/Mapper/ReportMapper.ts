import ReportEntity from "../../Domain/Entity/ReportEntity";
import { ReportResponseDTO } from "../../Domain/DTOs/ReportDTOs";

export class ReportMapper {
  static toResponseDTO(report: ReportEntity): ReportResponseDTO {
    return {
      id: report.id!,
      reporterId: report.reporterId,
      reportedId: report.reportedId,
      reason: report.reason,
      description: report.description,
      evidence: report.evidence,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      reporterName: report.reporterName,
      reportedName: report.reportedName,
    };
  }
}
