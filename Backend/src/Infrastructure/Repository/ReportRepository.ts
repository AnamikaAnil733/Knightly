import { BaseRepository } from "./BaseRepository";
import ReportEntity from "../../Domain/Entity/ReportEntity";
import { ReportDocument } from "../Database/Schema/ReportSchema";
import { IReportRepository } from "../../Domain/Interface/Repositories/IReportRepository";
import { MongoReportMapper } from "../Mapper/MongoReportMapper";
import { ReportModel } from "../Database/Model/ReportModel";

export class ReportRepository
  extends BaseRepository<ReportEntity, ReportDocument>
  implements IReportRepository
{
  constructor() {
    super(ReportModel, MongoReportMapper);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ reports: ReportEntity[]; total: number }> {
    const query: any = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("reporterId", "displayname email")
        .populate("reportedId", "displayname email")
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      reports: docs.map((doc) => this.mapper.toEntityFromDocument(doc)),
      total,
    };
  }
}
