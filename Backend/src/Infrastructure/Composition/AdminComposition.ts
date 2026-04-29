import { UserManagementRepository } from "../Repository/UserRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";
import { ReportRepository } from "../Repository/ReportRepository";
import { AchievementsRepository } from "../Repository/AchievementsRepository";

import { GetAllUserController } from "../../Presentation/Controllers/Admin/UserManagement/FindallUserController";
import {  BlockUserController }  from "../../Presentation/Controllers/Admin/UserManagement/BlockUserController";
import {  UnBlockUserController } from "../../Presentation/Controllers/Admin/UserManagement/UnBlockUserController";
import { AdminPuzzleController } from "../../Presentation/Controllers/Admin/PuzzleManagement/PuzzleManagementAdmin";
import { AdminReportController } from "../../Presentation/Controllers/Admin/Report/AdminReportController";
import { SystemSettingsController } from "../../Presentation/Controllers/Admin/Settings/SystemSettingsController";
import { AchievementController } from "../../Presentation/Controllers/Admin/AchievementManagement/AchievementController";

import { GetAllUserUseCase }  from "../../Application/UseCases/Admin/UserManagement/GetAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/BlockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/UnBlockUserUseCase";
import GetSubscriptionStatsUseCase from "../../Application/UseCases/Admin/UserManagement/GetSubscriptionStatsUseCase";
import GetAllTransactionsUseCase from "../../Application/UseCases/Admin/UserManagement/GetAllTransactionsUseCase";
import { GetSubscriptionStatsController } from "../../Presentation/Controllers/Admin/UserManagement/GetSubscriptionStatsController";
import { GetAllTransactionsController } from "../../Presentation/Controllers/Admin/UserManagement/GetAllTransactionsController";
import { TransactionRepository } from "../Repository/TransactionRepository";
import { CreatePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/CreatePuzzleUseCase";
import { GetallPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/GetAllPuzzleUseCase";
import { EditPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/EditPuzzleUseCase";
import { SoftDeletePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/DeletePuzzleUseCase";
import { SyncLichessDailyPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/SyncLichessDailyPuzzleUseCase";
import { GeneratePuzzleFromGameUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/GeneratePuzzleFromGameUseCase";
import GetAllLiveGamesUseCase from "../../Application/UseCases/Admin/GameManagement/GetAllLiveGamesUseCase";
import { GetAllLiveGamesController } from "../../Presentation/Controllers/Admin/GameManagement/GetAllLiveGamesController";
import { AuthRepository } from "../Repository/AuthRepository";
import { ChessGameRepository } from "../Repository/GameRepository";
import { AnalyticsRepository } from "../Repository/AnalyticsRepository";
import GetAdminAnalyticsUseCase from "../../Application/UseCases/Admin/Analytics/GetAdminAnalyticsUseCase";
import { GetAdminAnalyticsController } from "../../Presentation/Controllers/Admin/Analytics/GetAdminAnalyticsController";
import { SystemSettingsRepository } from "../Repository/SystemSettingsRepository";
import { GetSystemSettingsUseCase } from "../../Application/UseCases/Admin/Settings/GetSystemSettingsUseCase";
import { UpdateSystemSettingsUseCase } from "../../Application/UseCases/Admin/Settings/UpdateSystemSettingsUseCase";
import { GetReportsUseCase } from "../../Application/UseCases/Admin/Report/GetReportsUseCase";
import { UpdateReportStatusUseCase } from "../../Application/UseCases/Admin/Report/UpdateReportStatusUseCase";
import { AddAchievementsUseCase } from "../../Application/UseCases/Admin/AchievementManagement/AddAchievementsUseCase";
import { GetAllAchievementsUseCase } from "../../Application/UseCases/Admin/AchievementManagement/GetAllAchievementsUseCase";
import { UpdateAchievementUseCase } from "../../Application/UseCases/Admin/AchievementManagement/UpdateAchievementsUseCase";
import { DeleteAchievementUseCase } from "../../Application/UseCases/Admin/AchievementManagement/DeleteAchievementUseCase";




import { StockfishService } from "../../Domain/Chess/Service/StockfishService";
import { PuzzleGeneratorService } from "../Services/PuzzleGeneratorService";
import { TokenService } from "../Services/TokenService";
import { PuzzleValidationService } from "../Services/PuzzleValidationService";

import { authModel as AuthModel } from "../Database/Model/Authmodel";
import { TransactionModel } from "../Database/Model/TransactionModel";
import { GameModel } from "../Database/Model/GameModel";
import { SystemSettingsModel } from "../Database/Model/SystemSettingsModel";
import { AdminRoutes } from "../../Presentation/Routes/AdminRoute";

const UserManagementRepo = new UserManagementRepository();
const authRepo = new AuthRepository();
const puzzleMangementRepo = new PuzzleManagementRepository();
const transactionRepo = new TransactionRepository();
const analyticsRepo = new AnalyticsRepository(AuthModel, GameModel, TransactionModel);
const systemSettingsRepo = new SystemSettingsRepository(SystemSettingsModel);
const reportRepo = new ReportRepository();
const achievementsRepo = new AchievementsRepository();

//service
const tokenService = new TokenService();
const puzzleValidationService = new PuzzleValidationService();
const stockfishService = new StockfishService();
const puzzleGeneratorService = new PuzzleGeneratorService(stockfishService);
const chessGameRepo = new ChessGameRepository(GameModel);

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagementRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagementRepo);
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagementRepo);
const getSubscriptionStatsUseCase = new GetSubscriptionStatsUseCase(UserManagementRepo);
const getAllTransactionsUseCase = new GetAllTransactionsUseCase(transactionRepo);
const getAllLiveGamesUseCase = new GetAllLiveGamesUseCase(chessGameRepo, authRepo);
const getAdminAnalyticsUseCase = new GetAdminAnalyticsUseCase(analyticsRepo);
const getSystemSettingsUseCase = new GetSystemSettingsUseCase(systemSettingsRepo);
const updateSystemSettingsUseCase = new UpdateSystemSettingsUseCase(systemSettingsRepo);
const getReportsUseCase = new GetReportsUseCase(reportRepo);
const updateReportStatusUseCase = new UpdateReportStatusUseCase(reportRepo);
const createPuzzleUseCase = new CreatePuzzleUseCase(
  puzzleMangementRepo,
  puzzleValidationService,
);
const getAllPuzzleUseCase = new GetallPuzzleUseCase(puzzleMangementRepo);
const editPuzzleUseCase = new EditPuzzleUseCase(
  puzzleMangementRepo,
  puzzleValidationService,
);
const softDeletePuzzleUseCase = new SoftDeletePuzzleUseCase(
  puzzleMangementRepo,
);
const syncLichessPuzzleUseCase = new SyncLichessDailyPuzzleUseCase(
  puzzleGeneratorService,
  puzzleMangementRepo,
);
const generatePuzzleFromGameUseCase = new GeneratePuzzleFromGameUseCase(
  puzzleGeneratorService,
  puzzleMangementRepo,
  chessGameRepo,
);
const addAchievementsUseCase = new AddAchievementsUseCase(achievementsRepo);
const getAllAchievementsUseCase = new GetAllAchievementsUseCase(achievementsRepo);
const updateAchievementUseCase = new UpdateAchievementUseCase(achievementsRepo)
const deleteAchievementUseCase = new DeleteAchievementUseCase(achievementsRepo)


export const getAllUserController = new GetAllUserController(
  getAllUsersUseCase,
);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(
  unBlockUserUserCase,
);
export const getSubscriptionStatsController = new GetSubscriptionStatsController(
  getSubscriptionStatsUseCase,
);
export const getAllTransactionsController = new GetAllTransactionsController(
  getAllTransactionsUseCase,
);
export const getAllLiveGamesController = new GetAllLiveGamesController(
  getAllLiveGamesUseCase,
);
export const getAdminAnalyticsController = new GetAdminAnalyticsController(
  getAdminAnalyticsUseCase,
);

export const systemSettingsController = new SystemSettingsController(
  getSystemSettingsUseCase,
  updateSystemSettingsUseCase,
);
export const adminReportController = new AdminReportController(getReportsUseCase, updateReportStatusUseCase);

export const PuzzleManagementController = new AdminPuzzleController(
  createPuzzleUseCase,
  getAllPuzzleUseCase,
  editPuzzleUseCase,
  softDeletePuzzleUseCase,
  syncLichessPuzzleUseCase,
  generatePuzzleFromGameUseCase,
);
export const achievementController = new AchievementController(
  addAchievementsUseCase,
  getAllAchievementsUseCase,
  updateAchievementUseCase,
  deleteAchievementUseCase,
);

export const adminRoutes = new AdminRoutes(tokenService);
