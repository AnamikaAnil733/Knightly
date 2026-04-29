import { Router } from "express";
import { getAllUserController,
  banUserController,
  unBanUserController,
  getSubscriptionStatsController,
  getAllTransactionsController,
  getAllLiveGamesController,
  getAdminAnalyticsController,
  systemSettingsController,
  PuzzleManagementController,
  adminReportController,
  achievementController,
} from "../../Infrastructure/Composition/AdminComposition";
import { lessonController } from "../../Infrastructure/Composition/LessonComposition";
import { blogController } from "../../Infrastructure/Composition/BlogComposition";

import { authMiddleware } from "../Middleware/AuthMiddleware";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { ADMIN_ROUTES } from "../Constants/Routes/AdminRoutes";


export class AdminRoutes{
  public readonly router :Router;

  constructor(tokenService: ITokenService){
    this.router = Router();
    this.router.use(
      authMiddleware([UserRole.ADMIN],tokenService),
    );
    this.initializeRoutes();
  }

  private  initializeRoutes(){

    this.router.get(ADMIN_ROUTES.USERS,getAllUserController.getallusers);
    this.router.patch(ADMIN_ROUTES.BAN_USER,banUserController.handleUserBan);
    this.router.patch(ADMIN_ROUTES.UNBAN_USER,unBanUserController.handleUserUnBan);
    this.router.get(ADMIN_ROUTES.SUBSCRIPTION_STATS, getSubscriptionStatsController.stats);
    this.router.get(ADMIN_ROUTES.TRANSACTIONS, getAllTransactionsController.getAll);
    this.router.get(ADMIN_ROUTES.LIVE_GAMES, getAllLiveGamesController.getAll);
    this.router.get(ADMIN_ROUTES.GET_ANALYTICS, getAdminAnalyticsController.getAnalytics);
    this.router.get(ADMIN_ROUTES.SYSTEM_SETTINGS, systemSettingsController.getSettings);
    this.router.patch(ADMIN_ROUTES.SYSTEM_SETTINGS, systemSettingsController.updateSettings);

    //Puzzle Management routes
    this.router.post(ADMIN_ROUTES.CREATEPUZZLES,PuzzleManagementController.createPuzzle);
    this.router.get(ADMIN_ROUTES.PUZZLES,PuzzleManagementController.getAllPuzzles);
    this.router.patch(ADMIN_ROUTES.EDITPUZZLE,PuzzleManagementController.editPuzzles);
    this.router.delete(ADMIN_ROUTES.DELETEPUZZLE,PuzzleManagementController.softDeletePuzzle);
    this.router.post(ADMIN_ROUTES.SYNC_LICHESS_PUZZLE, PuzzleManagementController.syncDailyPuzzle);
    this.router.post(ADMIN_ROUTES.GENERATE_AI_PUZZLES, PuzzleManagementController.generatePuzzlesFromGame);
    this.router.post(ADMIN_ROUTES.GENERATE_PUZZLE_FROM_GAME, PuzzleManagementController.generatePuzzlesFromGame);


    // Achievement Management routes
    this.router.post(ADMIN_ROUTES.CREATE_ACHIEVEMENTS,achievementController.createAchievements);
    this.router.get(ADMIN_ROUTES.GET_ACHIEVEMENTS,achievementController.getAllAchievements);

    // Lesson management routes
    this.router.post(ADMIN_ROUTES.LESSON, lessonController.createLesson);
    this.router.put(ADMIN_ROUTES.EDIT_LESSON, lessonController.updateLesson);
    this.router.delete(ADMIN_ROUTES.DELETE_LESSON, lessonController.deleteLesson);
    this.router.get(ADMIN_ROUTES.CREATE_LESSON, lessonController.getLessons);
    
    // Blog management routes
    this.router.get(ADMIN_ROUTES.BLOGS, blogController.adminGetAllBlogs);
    this.router.get(ADMIN_ROUTES.GET_BLOG_BY_ID, blogController.adminGetBlogById);
    this.router.patch(ADMIN_ROUTES.MODERATE_BLOG, blogController.moderateBlog);

    // Report management routes
    this.router.get(ADMIN_ROUTES.REPORTS, adminReportController.handleGetReports);
    this.router.patch(ADMIN_ROUTES.MODERATE_REPORT, adminReportController.handleUpdateStatus);
  }
}
