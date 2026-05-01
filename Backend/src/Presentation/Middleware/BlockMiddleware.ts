import { HttpStatusCodes } from "../../Domain/Types/StatusCode";
import { Request, Response, NextFunction } from "express";
import { IUserRepository } from "../../Domain/Interface/Repositories/IUserRepository";

export const checkBlockedUser = (userRepository: IUserRepository) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
      }

      const userDoc = await userRepository.findById(user.id);

      if (userDoc?.isBlocked) {
        return res.status(HttpStatusCodes.FORBIDDEN).json({
          message: "You are blocked, please logout...",
          forceLogout: true,
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };