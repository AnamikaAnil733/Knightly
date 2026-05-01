import { Router } from "express";
import {
  editUserController,
  changePasswordController,
  avatarController,
  gameController,
  userPuzzleController,
  leaderBoardController,
  friendController,
  reportController,
  userAchievementController,
} from "../../Infrastructure/Composition/UserComposition";
import { lessonController } from "../../Infrastructure/Composition/LessonComposition";
import { blogController } from "../../Infrastructure/Composition/BlogComposition";

import { authMiddleware } from "../Middleware/AuthMiddleware";
import { checkBlockedUser } from "../Middleware/BlockMiddleware";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { USER_ROUTES } from "../Constants/Routes/UserRoutes";
import { IUserRepository } from "../../Domain/Interface/Repositories/IUserRepository";

export class UserRoutes {
  public readonly router: Router;
  constructor(tokenService: ITokenService, userRepository: IUserRepository) {
    this.router = Router();
    this.router.use(authMiddleware([UserRole.USER], tokenService));
    this.router.use(checkBlockedUser(userRepository));
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
    this.router.get(
      USER_ROUTES.GET_GAME_HISTORY,
      gameController.getGameHistory,
    );
    this.router.get(USER_ROUTES.GET_LIVE_GAMES, gameController.getLiveGames);
    this.router.get(USER_ROUTES.GET_GAME, gameController.getGame);
    this.router.get(USER_ROUTES.LEGAL_MOVES, gameController.legalMove);
    this.router.post(USER_ROUTES.MAKE_MOVE, gameController.makeMove);
    this.router.get(USER_ROUTES.REVIEW_GAME, gameController.reviewGame);

    this.router.get(
      USER_ROUTES.GET_PUZZLE_BY_DIFFICULTY,
      userPuzzleController.getPuzzle,
    );
    this.router.get(
      USER_ROUTES.GET_DAILY_PUZZLE,
      userPuzzleController.getDailyPuzzle,
    );
    this.router.post(
      USER_ROUTES.VALIDATE_PUZZLE_MOVE,
      userPuzzleController.validateMove,
    );
    this.router.get(
      USER_ROUTES.GET_PUZZLE_SOLVE_COUNT,
      userPuzzleController.getSolveCount,
    );
    this.router.get(
      USER_ROUTES.GET_PUZZLE_HISTORY,
      userPuzzleController.getSolveHistory,
    );
    this.router.get(
      USER_ROUTES.LEADERBOARD,
      leaderBoardController.getLeaderBoard,
    );

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

    // Learning routes
    this.router.get(USER_ROUTES.LEARN, lessonController.getLessons);
    this.router.get(USER_ROUTES.LEARN_ID, lessonController.getLessonById);

    //Blog routes
    this.router.post(USER_ROUTES.BLOG_UPLOADURL, blogController.getCoverUploadUrl);
    this.router.post(USER_ROUTES.BLOG, blogController.createBlog);
    this.router.get(USER_ROUTES.BLOGS, blogController.getAllBlogs);
    this.router.get(USER_ROUTES.BLOG_DETAIL, blogController.getBlogBySlug);
    this.router.post(USER_ROUTES.BLOG_VIEW, blogController.incrementView);
    this.router.get(USER_ROUTES.MY_BLOGS, blogController.getUserBlogs);
    this.router.patch(USER_ROUTES.UPDATE_BLOG, blogController.updateBlog);
    this.router.delete(USER_ROUTES.DELETE_BLOG, blogController.deleteBlog);
    this.router.get(USER_ROUTES.BLOG_BY_ID, blogController.getBlogById);
    this.router.post(USER_ROUTES.BLOG_TOGGLE_LIKE, blogController.toggleLike);
    this.router.post(USER_ROUTES.BLOG_COMMENTS, blogController.addComment);
    this.router.get(USER_ROUTES.BLOG_COMMENTS, blogController.getComments);
    this.router.delete(USER_ROUTES.BLOG_DELETE_COMMENT, blogController.deleteComment);

    // Report Route
    this.router.post(USER_ROUTES.REPORT, reportController.handleCreateReport);

    // Achievement routes
    this.router.get(USER_ROUTES.EARNED_ACHIEVEMENTS, userAchievementController.getEarnedAchievements);
    this.router.get(USER_ROUTES.ALL_ACHIEVEMENTS, userAchievementController.getAllAchievements);
    this.router.post(USER_ROUTES.CHECK_ACHIEVEMENTS, userAchievementController.checkProgress);
  }
}
