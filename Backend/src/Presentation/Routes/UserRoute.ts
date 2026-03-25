import { Router } from "express";
import {
  editUserController,
  changePasswordController,
  avatarController,
  gameController,
  userPuzzleController,
  leaderBoardController,
  friendController,
} from "../../Infrastructure/Composition/UserComposition";
import { authMiddleware } from "../Middleware/AuthMiddleware";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { USER_ROUTES } from "../Constants/Routes/UserRoutes";

export class UserRoutes {
  public readonly router: Router;
  constructor(tokenService: ITokenService) {
    this.router = Router();
    this.router.use(authMiddleware([UserRole.USER], tokenService));

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.patch(
      USER_ROUTES.EDIT_PROFILE,
      editUserController.handleEditProfile,
    );
    this.router.patch(
      USER_ROUTES.CHANGE_PASSWORD,
      changePasswordController.handleChangePassword,
    );
    this.router.post(USER_ROUTES.AVATAR.UPLOAD, avatarController.getAvatarUrl);
    this.router.post(
      USER_ROUTES.AVATAR.DICEBEAR,
      avatarController.saveDiceBearAvatar,
    );
    this.router.get(USER_ROUTES.PROFILE, avatarController.getProfile);
    this.router.post(USER_ROUTES.CREATE_GAME, gameController.createGame);
    this.router.get(USER_ROUTES.GET_GAME, gameController.getGame);
    this.router.get(USER_ROUTES.LEGAL_MOVES, gameController.legalMove);
    this.router.post(USER_ROUTES.MAKE_MOVE, gameController.makeMove);
    this.router.get(USER_ROUTES.REVIEW_GAME, gameController.reviewGame);
    this.router.get(
      USER_ROUTES.GET_PUZZLE_BY_DIFFICULTY,
      userPuzzleController.getPuzzle,
    );
    this.router.post(
      USER_ROUTES.VALIDATE_PUZZLE_MOVE,
      userPuzzleController.validateMove,
    );
    this.router.get(
      USER_ROUTES.LEADERBOARD,
      leaderBoardController.getLeaderBoard,
    );

    // Friend Routes
    this.router.post(
      USER_ROUTES.FRIENDS.SEND_REQUEST,
      friendController.sendRequest,
    );
    this.router.post(
      USER_ROUTES.FRIENDS.ACCEPT_REQUEST,
      friendController.acceptRequest,
    );
    this.router.post(
      USER_ROUTES.FRIENDS.REJECT_REQUEST,
      friendController.rejectRequest,
    );
    this.router.post(
      USER_ROUTES.FRIENDS.UNFRIEND,
      friendController.unfriend,
    );
    this.router.post(
      USER_ROUTES.FRIENDS.BLOCK,
      friendController.blockUser,
    );
    this.router.post(
      USER_ROUTES.FRIENDS.UNBLOCK,
      friendController.unblockUser,
    );
    this.router.get(USER_ROUTES.FRIENDS.LIST, friendController.getFriends);
    this.router.get(USER_ROUTES.FRIENDS.SEARCH, friendController.searchUsers);
    this.router.get(
      USER_ROUTES.FRIENDS.PENDING_REQUESTS,
      friendController.getPendingRequests,
    );
  }
}
