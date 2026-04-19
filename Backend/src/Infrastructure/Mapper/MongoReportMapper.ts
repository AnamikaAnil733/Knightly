import { HydratedDocument } from "mongoose";
import ReportEntity from "../../Domain/Entity/ReportEntity";
import { ReportDocument } from "../Database/Schema/ReportSchema";

export class MongoReportMapper {
  static toEntityFromDocument(doc: HydratedDocument<ReportDocument>): ReportEntity {
    return new ReportEntity({
      id: doc._id.toString(),
      reporterId: (doc.reporterId as any)._id?.toString() || doc.reporterId.toString(),
      reportedId: (doc.reportedId as any)._id?.toString() || doc.reportedId.toString(),
      reason: doc.reason,
      description: doc.description,
      evidence: doc.evidence,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      reporterName: (doc.reporterId as any).displayname,
      reportedName: (doc.reportedId as any).displayname,
    });
  }

  static toDocumentFromEntity(report: ReportEntity) {
    return {
      reporterId: report.reporterId,
      reportedId: report.reportedId,
      reason: report.reason,
      description: report.description,
      evidence: report.evidence,
      status: report.status,
    };
  }
}
