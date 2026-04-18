import { NextFunction, Request, Response } from "express";
import { ISystemSettingsRepository } from "../../Domain/Interface/Repositories/ISystemSettingsRepository";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";

// In-memory cache for maintenance status to improve performance and prevent race conditions
let cachedMaintenanceMode: boolean | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 3000; // 3 seconds

export function maintenanceMiddleware(
  settingsRepo: ISystemSettingsRepository,
  tokenService: ITokenService,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Whitelist critical routes
    const whitelistedPaths = [
      "/api/auth/settings", // Publicly needed to check maintenance state
      "/api/auth/login",    // Admins need to log in
      "/api/auth/refresh",  // Session renewal
      "/api/admin/settings", // IMPORTANT: Admins must be able to turn maintenance OFF
    ];

    const isWhitelisted = whitelistedPaths.some(path => req.originalUrl.startsWith(path));

    // 2. Identify User Early (if possible) for Admin Bypass
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

    // Admins always pass
    if (isAdmin) return next();

    // Whitelisted routes always pass
    if (isWhitelisted) return next();

    try {
      // 3. Get Maintenance Mode (with brief caching)
      const now = Date.now();
      if (cachedMaintenanceMode === null || (now - lastCacheUpdate) > CACHE_TTL) {
        const settings = await settingsRepo.getSettings();
        cachedMaintenanceMode = settings.general.maintenanceMode;
        lastCacheUpdate = now;
      }

      if (!cachedMaintenanceMode) {
        return next();
      }

      // 4. Block access
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
