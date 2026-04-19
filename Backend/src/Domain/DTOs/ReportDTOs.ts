import { ReportReason, ReportStatus } from "../Types/ReportTypes";

export interface CreateReportInputDTO {
  reportedId: string;
  reason: ReportReason;
  description: string;
  evidence?: any;
}

export interface ReportResponseDTO {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedId: string;
  reportedName?: string;
  reason: ReportReason;
  description: string;
  evidence?: any;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}
