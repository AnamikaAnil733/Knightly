import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../../../../Domain/Types/StatusCode";
import SendFriendRequestUseCase from "../../../../Application/UseCases/User/FriendManagement/SendFriendRequestUseCase";
import AcceptFriendRequestUseCase from "../../../../Application/UseCases/User/FriendManagement/AcceptFriendRequestUseCase";
import GetFriendsListUseCase from "../../../../Application/UseCases/User/FriendManagement/GetFriendsListUseCase";
import SearchUsersUseCase from "../../../../Application/UseCases/User/FriendManagement/SearchUsersUseCase";
import GetPendingRequestsUseCase from "../../../../Application/UseCases/User/FriendManagement/GetPendingRequestsUseCase";
import RejectFriendRequestUseCase from "../../../../Application/UseCases/User/FriendManagement/RejectFriendRequestUseCase";

export class FriendController {
  constructor(
    private sendFriendRequestUseCase: SendFriendRequestUseCase,
    private acceptFriendRequestUseCase: AcceptFriendRequestUseCase,
    private getFriendsListUseCase: GetFriendsListUseCase,
    private searchUsersUseCase: SearchUsersUseCase,
    private getPendingRequestsUseCase: GetPendingRequestsUseCase,
    private rejectFriendRequestUseCase: RejectFriendRequestUseCase,
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
