import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import { ISendFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISendFriendRequestUseCase";
import { IAcceptFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IAcceptFriendRequestUseCase";
import { IGetFriendsListUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetFriendsListUseCase";
import { ISearchUsersUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/ISearchUsersUseCase";
import { IGetPendingRequestsUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IGetPendingRequestsUseCase";
import { IRejectFriendRequestUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IRejectFriendRequestUseCase";
import { IUnfriendUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IUnfriendUseCase";
import { IBlockUserUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IBlockUserUseCase";
import { IUnblockUserUseCase } from "../../../../Domain/Interface/Usecases/User/FriendManagement/IUnblockUserUseCase";


export class FriendController {
  constructor(
    private sendFriendRequestUseCase: ISendFriendRequestUseCase,
    private acceptFriendRequestUseCase: IAcceptFriendRequestUseCase,
    private getFriendsListUseCase: IGetFriendsListUseCase,
    private searchUsersUseCase: ISearchUsersUseCase,
    private getPendingRequestsUseCase: IGetPendingRequestsUseCase,
    private rejectFriendRequestUseCase: IRejectFriendRequestUseCase,
    private unfriendUseCase: IUnfriendUseCase,
    private blockUserUseCase: IBlockUserUseCase,
    private unblockUserUseCase: IUnblockUserUseCase,
  ) {}

  searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req as any).user.id;
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(HttpStatusCodes.OK).json({ success: true, users: [] });
      }

      const users = await this.searchUsersUseCase.execute(query, currentUserId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        users,
      });
    } catch (error) {
      next(error);
    }
  };

  sendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requesterId = (req as any).user.id;
      const { recipientId } = req.body;

      await this.sendFriendRequestUseCase.execute(requesterId, recipientId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Friend request sent successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = (req as any).user.id;
      const { requesterId } = req.body;

      await this.acceptFriendRequestUseCase.execute(requesterId, recipientId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Friend request accepted.",
      });
    } catch (error) {
      next(error);
    }
  };

  rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipientId = (req as any).user.id;
      const { requesterId } = req.body;

      await this.rejectFriendRequestUseCase.execute(requesterId, recipientId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Friend request rejected.",
      });
    } catch (error) {
      next(error);
    }
  };

  unfriend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req as any).user.id;
      const { friendId } = req.body;

      await this.unfriendUseCase.execute(currentUserId, friendId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "User unfriended successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req as any).user.id;
      const { friendId } = req.body;

      await this.blockUserUseCase.execute(currentUserId, friendId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "User blocked successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  unblockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req as any).user.id;
      const { friendId } = req.body;

      await this.unblockUserUseCase.execute(currentUserId, friendId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "User unblocked successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

  getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      const friends = await this.getFriendsListUseCase.execute(userId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        friends,
      });
    } catch (error) {
      next(error);
    }
  };

  getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const requests = await this.getPendingRequestsUseCase.execute(userId);

      return res.status(HttpStatusCodes.OK).json({
        success: true,
        requests,
      });
    } catch (error) {
      next(error);
    }
  };
}
