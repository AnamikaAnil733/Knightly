import { Request, Response, NextFunction } from "express";
import { IGetSystemSettingsUseCase, IUpdateSystemSettingsUseCase } from "../../../../Domain/Interface/Usecases/Admin/Settings/ISystemSettingsUseCase";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { SystemSettingsMapper } from "../../../../Application/Mapper/SystemSettingsMapper";

export class SystemSettingsController {
  constructor(
    private readonly _getSettingsUseCase: IGetSystemSettingsUseCase,
    private readonly _updateSettingsUseCase: IUpdateSystemSettingsUseCase,
  ) {}

  getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const data = await this._getSettingsUseCase.execute();
      return res.status(HttpStatusCodes.OK).json(SystemSettingsMapper.toAdminDTO(data));
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const data = await this._updateSettingsUseCase.execute(req.body);
      return res.status(HttpStatusCodes.OK).json(SystemSettingsMapper.toAdminDTO(data));
    } catch (error) {
      next(error);
    }
  };
}
