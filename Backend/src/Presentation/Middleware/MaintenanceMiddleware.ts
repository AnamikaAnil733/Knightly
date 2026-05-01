import { NextFunction, Request, Response } from "express";
import { ISystemSettingsRepository } from "../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";

let cachedMaintenanceMode: boolean | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 3000; // 3 seconds

export function maintenanceMiddleware(
  settingsRepo: ISystemSettingsRepository,
  tokenService: ITokenService,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
   
    const whitelistedPaths = [
      "/api/auth/settings",
      "/api/auth/login", 
      "/api/auth/refresh", 
      "/api/admin/settings", 
    ];

    const isWhitelisted = whitelistedPaths.some(path => req.originalUrl.startsWith(path));

    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const data = tokenService.verifyAccessToken(token);
        if (data.role === UserRole.ADMIN) {
          isAdmin = true;
        }
      } catch (err) {}
    }

   
    if (isAdmin) return next();

  
    if (isWhitelisted) return next();

    try {

      const now = Date.now();
      if (cachedMaintenanceMode === null || (now - lastCacheUpdate) > CACHE_TTL) {
        const settings = await settingsRepo.getSettings();
        cachedMaintenanceMode = settings.general.maintenanceMode;
        lastCacheUpdate = now;
      }

      if (!cachedMaintenanceMode) {
        return next();
      }

      return res.status(503).json({
        success: false,
        message: "Platform is under maintenance. Please try again later.",
        retryAfter: 3600,
      });

    } catch (error) {
      return next();
    }
  };
}
