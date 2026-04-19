import { Request, Response } from "express";
import { IGetReportsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Report/IGetReportsUseCase";
import { IUpdateReportStatusUseCase } from "../../../../Domain/Interface/Usecases/Admin/Report/IUpdateReportStatusUseCase";
import { ReportStatus } from "../../../../Domain/Types/ReportTypes";
import { ReportMapper } from "../../../../Application/Mapper/ReportMapper";

export class AdminReportController {
  constructor(
    private readonly _getReportsUseCase: IGetReportsUseCase,
    private readonly _updateReportStatusUseCase: IUpdateReportStatusUseCase,
  ) {}

  public handleGetReports = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as ReportStatus | undefined;

      const { reports, total } = await this._getReportsUseCase.execute({
        page,
        limit,
        status,
      });

      res.status(200).json({
        reports: reports.map((r) => ReportMapper.toResponseDTO(r)),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  };

  public handleUpdateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(ReportStatus).includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await this._updateReportStatusUseCase.execute(id, status);

      res.status(200).json({ message: "Report status updated successfully" });
    } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
