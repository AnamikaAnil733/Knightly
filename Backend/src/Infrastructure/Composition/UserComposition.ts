import { UserManagementRepository } from "../Repository/UserRepository";
import { AuthRepository } from "../Repository/AuthRepository";
import { ChessGameRepository } from "../Repository/GameRepository";
import { UserPuzzleProgressRepository } from "../Repository/UserPuzzleProgressRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";
import { FriendshipRepository } from "../Repository/FriendshipRepository";
import { ReportRepository } from "../Repository/ReportRepository";
import { AchievementsRepository } from "../Repository/AchievementsRepository";
import { UserAchievementRepository } from "../Repository/UserAchievementRepository";

import { EditProfileController } from "../../Presentation/Controllers/User/ProfileManagement/UpdateProfileController";
import { ChangePassswordController } from "../../Presentation/Controllers/User/ProfileManagement/ChangePasswordController";
import { AvatarController } from "../../Presentation/Controllers/User/ProfileManagement/AvatarController";
import { GameController } from "../../Presentation/Controllers/User/GameManagement/GameController";
import { UserPuzzleController } from "../../Presentation/Controllers/User/PuzzleManagement/PuzzleController";
import { FriendController } from "../../Presentation/Controllers/User/FriendManagement/FriendController";
import { ReportController } from "../../Presentation/Controllers/User/Report/ReportController";
import { UserAchievementController } from "../../Presentation/Controllers/User/Achievement/UserAchievementController";

import {  EditUserUseCase } from "../../Application/UseCases/User/ProfileManagement/EditUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/User/ProfileManagement/ChangePasswordUseCase";
import { CreateGameUseCase } from "../../Application/UseCases/User/GameManagement/CreateGameUseCase";
import { GetGameUseCase } from "../../Application/UseCases/User/GameManagement/GetGameUseCase";
import { MakeMoveUsecase } from "../../Application/UseCases/User/GameManagement/MakeMoveUseCase";
import { GetLegalMovesUseCase } from "../../Application/UseCases/User/GameManagement/GetLegalMovesUseCase";
import { ReviewGameUseCase } from "../../Application/UseCases/User/GameManagement/ReviewGameUseCase";
import { GetGameHistoryUseCase } from "../../Application/UseCases/User/GameManagement/GetGameHistoryUseCase";
import { GetLivePublicGamesUseCase } from "../../Application/UseCases/User/GameManagement/GetLivePublicGamesUseCase";

import { GetPuzzleDifficultyUsecase } from "../../Application/UseCases/User/PuzzleManagement/GetPuzzleByDifficultyUseCase";
import { ValidatePuzzlesMoves } from "../../Application/UseCases/User/PuzzleManagement/ValidatePuzzleUseCase";
import { GetPuzzleSolveCountUseCase } from "../../Application/UseCases/User/PuzzleManagement/GetPuzzleSolveCountUseCase";
import { GetDailyPuzzleUseCase } from "../../Application/UseCases/User/PuzzleManagement/GetDailyPuzzleUseCase";
import { GetPuzzleSolveHistoryUseCase } from "../../Application/UseCases/User/PuzzleManagement/GetPuzzleSolveHistoryUseCase";

import { GetAvatarUrlUseCase } from "../../Application/UseCases/User/ProfileManagement/AvatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/User/ProfileManagement/SaveDiceBearAvatarUseCase";
import { GetUserProfileUseCase } from "../../Application/UseCases/User/ProfileManagement/GetUserProfileUseCase";
import SendFriendRequestUseCase from "../../Application/UseCases/User/FriendManagement/SendFriendRequestUseCase";
import AcceptFriendRequestUseCase from "../../Application/UseCases/User/FriendManagement/AcceptFriendRequestUseCase";
import GetFriendsListUseCase from "../../Application/UseCases/User/FriendManagement/GetFriendsListUseCase";
import SearchUsersUseCase from "../../Application/UseCases/User/FriendManagement/SearchUsersUseCase";
import GetPendingRequestsUseCase from "../../Application/UseCases/User/FriendManagement/GetPendingRequestsUseCase";
import RejectFriendRequestUseCase from "../../Application/UseCases/User/FriendManagement/RejectFriendRequestUseCase";
import UnfriendUseCase from "../../Application/UseCases/User/FriendManagement/UnfriendUseCase";
import BlockUserUseCase from "../../Application/UseCases/User/FriendManagement/BlockUserUseCase";
import UnblockUserUseCase from "../../Application/UseCases/User/FriendManagement/UnblockUserUseCase";
import { CreateReportUseCase } from "../../Application/UseCases/User/Report/CreateReportUseCase";

import { GetEarnedAchievementsUseCase } from "../../Application/UseCases/User/Achievement/GetEarnedAchievementsUseCase";
import { CheckAndAwardAchievementUseCase } from "../../Application/UseCases/User/Achievement/CheckAndAwardAchievementUseCase";
import { GetAllAchievementsWithProgressUseCase } from "../../Application/UseCases/User/Achievement/GetAllAchievementsWithProgressUseCase";


import { TokenService } from "../Services/TokenService";
import {  HashService } from "../Services/PasswordHashing";
import { S3StorageService } from "../Services/S3Service";
import { MediaService } from "../Services/MediaService";
import { AchievementService } from "../Services/AchievementService";

import {GameModel} from "../Database/Model/GameModel";
import { StockfishService } from "../../Domain/Chess/Service/StockfishService";

import { UserRoutes } from "../../Presentation/Routes/UserRoute";


import { LeaderBoardRepository } from "../Repository/LeaderBoardRepository";
import { GetLeaderBoardUseCase } from "../../Application/UseCases/User/LeaderBoard/GetLeaderBoardUseCase";
import { LeaderBoardController } from "../../Presentation/Controllers/User/LeaderBoard/LeaderBoardController";

const UserRepo = new UserManagementRepository();
const AuthRepo = new AuthRepository();
const GameRepo = new ChessGameRepository(GameModel);
const PuzzleRepo = new PuzzleManagementRepository();
const ProgressPuzzleRepo = new UserPuzzleProgressRepository();
const LeaderRepo = new LeaderBoardRepository();
const FriendshipRepo = new FriendshipRepository();
const ReportRepo = new ReportRepository();
const AchievementRepo = new AchievementsRepository();
const UserAchievementRepo = new UserAchievementRepository();

//service
const tokenService = new TokenService();
const hashService = new HashService();
const S3Service = new S3StorageService();
const mediaService = new MediaService(S3Service);
const stockfishService = new StockfishService();
const achievementService = new AchievementService(AchievementRepo,UserAchievementRepo);

//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo, hashService);
const getAvatarUrlUseCase = new GetAvatarUrlUseCase(S3Service);
const saveDiceBearAvatarUseCase = new SaveDiceBearAvatarUseCase(
  S3Service,
  UserRepo,
);
const getUserProfileUseCase = new GetUserProfileUseCase(UserRepo, mediaService);
const createGameUseCase = new CreateGameUseCase(GameRepo);
const getGameUseCase = new GetGameUseCase(GameRepo, UserRepo, mediaService);
const getLegalMovesUseCase = new GetLegalMovesUseCase(GameRepo);
const makeMoveUseCase = new MakeMoveUsecase(GameRepo);
const getpuzzleUseCase = new GetPuzzleDifficultyUsecase(
  PuzzleRepo,
  ProgressPuzzleRepo,
  UserRepo,
);

const getPuzzleSolveCountUseCase = new GetPuzzleSolveCountUseCase(ProgressPuzzleRepo);
const getDailyPuzzleUseCase = new GetDailyPuzzleUseCase(PuzzleRepo);
const getPuzzleSolveHistoryUseCase = new GetPuzzleSolveHistoryUseCase(ProgressPuzzleRepo, GameRepo);
const reviewGameUseCase = new ReviewGameUseCase(GameRepo, stockfishService, UserRepo);
const getGameHistoryUseCase = new GetGameHistoryUseCase(GameRepo, UserRepo);
const getLivePublicGamesUseCase = new GetLivePublicGamesUseCase(GameRepo);
const getLeaderBoardUseCase = new GetLeaderBoardUseCase(LeaderRepo, mediaService);

const sendFriendRequestUseCase = new SendFriendRequestUseCase(FriendshipRepo, UserRepo);
const acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(FriendshipRepo);
const getFriendsListUseCase = new GetFriendsListUseCase(FriendshipRepo, UserRepo, mediaService);
const searchUsersUseCase = new SearchUsersUseCase(UserRepo, mediaService);
const getPendingRequestsUseCase = new GetPendingRequestsUseCase(FriendshipRepo, UserRepo, mediaService);
const rejectFriendRequestUseCase = new RejectFriendRequestUseCase(FriendshipRepo);
const unfriendUseCase = new UnfriendUseCase(FriendshipRepo);
const blockUserUseCase = new BlockUserUseCase(FriendshipRepo);
const unblockUserUseCase = new UnblockUserUseCase(FriendshipRepo);
const createReportUseCase = new CreateReportUseCase(ReportRepo);

const getEarnedAchievementsUseCase = new GetEarnedAchievementsUseCase(UserAchievementRepo, AchievementRepo);
const checkAndAwardAchievementUseCase = new CheckAndAwardAchievementUseCase(achievementService);
const getAllAchievementsWithProgressUseCase = new GetAllAchievementsWithProgressUseCase(AchievementRepo, UserAchievementRepo);
const validatePuzzleUsecase = new ValidatePuzzlesMoves(
  PuzzleRepo,
  ProgressPuzzleRepo,
  AuthRepo,
  checkAndAwardAchievementUseCase,
  getPuzzleSolveCountUseCase
);


export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(
  changePasswordUseCase,
);
export const avatarController = new AvatarController(
  getAvatarUrlUseCase,
  getUserProfileUseCase,
  saveDiceBearAvatarUseCase,
);
export const gameController = new GameController(
  createGameUseCase,
  getGameUseCase,
  getLegalMovesUseCase,
  makeMoveUseCase,
  reviewGameUseCase,
  getGameHistoryUseCase,
  getLivePublicGamesUseCase,
);
export const userPuzzleController = new UserPuzzleController(
  getpuzzleUseCase,
  validatePuzzleUsecase,
  getPuzzleSolveCountUseCase,
  getDailyPuzzleUseCase,
  getPuzzleSolveHistoryUseCase,
);
export const leaderBoardController = new LeaderBoardController(
  getLeaderBoardUseCase,
);
export const friendController = new FriendController(
  sendFriendRequestUseCase,
  acceptFriendRequestUseCase,
  getFriendsListUseCase,
  searchUsersUseCase,
  getPendingRequestsUseCase,
  rejectFriendRequestUseCase,
  unfriendUseCase,
  blockUserUseCase,
  unblockUserUseCase,
);
export const reportController = new ReportController(createReportUseCase);
export const userAchievementController = new UserAchievementController(getEarnedAchievementsUseCase, checkAndAwardAchievementUseCase, getAllAchievementsWithProgressUseCase);
export const achievementServiceLive = achievementService; // Export for App.ts
export const userRoutes = new UserRoutes(tokenService, AuthRepo);
