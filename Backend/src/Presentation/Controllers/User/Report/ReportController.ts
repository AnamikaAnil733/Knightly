import { Request, Response } from "express";
import { ICreateReportUseCase } from "../../../../Domain/Interface/Usecases/User/Report/ICreateReportUseCase";
import { CreateReportInputDTO } from "../../../../Domain/DTOs/ReportDTOs";

export class ReportController {
  constructor(private readonly _createReportUseCase: ICreateReportUseCase) {}

  public handleCreateReport = async (req: Request, res: Response) => {
    try {
      const reporterId = (req as any).user.id;
      const { reportedId, reason, description, evidence } = req.body as CreateReportInputDTO;

      await this._createReportUseCase.execute({
        reporterId,
        reportedId,
        reason,
        description,
        evidence,
      });

      res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
