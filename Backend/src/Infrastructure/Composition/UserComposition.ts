import { UserManagementRepository } from "../Repository/UserRepository";
import { ChessGameRepository } from "../Repository/GameRepository";
import { UserPuzzleProgressRepository } from "../Repository/UserPuzzleProgressRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";
import { FriendshipRepository } from "../Repository/FriendshipRepository";

import { EditProfileController } from "../../Presentation/Controllers/User/ProfileManagement/UpdateProfileController";
import { ChangePassswordController } from "../../Presentation/Controllers/User/ProfileManagement/ChangePasswordController";
import { AvatarController } from "../../Presentation/Controllers/User/ProfileManagement/AvatarController";
import { GameController } from "../../Presentation/Controllers/User/GameManagement/GameController";
import { UserPuzzleController } from "../../Presentation/Controllers/User/PuzzleManagement/PuzzleController";
import { FriendController } from "../../Presentation/Controllers/User/FriendManagement/FriendController";

import {  EditUserUseCase } from "../../Application/UseCases/User/ProfileManagement/EditUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/User/ProfileManagement/ChangePasswordUseCase";
import { CreateGameUseCase } from "../../Application/UseCases/User/GameManagement/CreateGameUseCase";
import { GetGameUseCase } from "../../Application/UseCases/User/GameManagement/GetGameUseCase";
import { MakeMoveUsecase } from "../../Application/UseCases/User/GameManagement/MakeMoveUseCase";
import { GetLegalMovesUseCase } from "../../Application/UseCases/User/GameManagement/GetLegalMovesUseCase";
import { ReviewGameUseCase } from "../../Application/UseCases/User/GameManagement/ReviewGameUseCase";

import { GetPuzzleDifficultyUsecase } from "../../Application/UseCases/User/PuzzleManagement/GetPuzzleByDifficultyUseCase";
import { ValidatePuzzlesMoves } from "../../Application/UseCases/User/PuzzleManagement/ValidatePuzzleUseCase";

import { GetAvatarUrlUseCase } from "../../Application/UseCases/User/ProfileManagement/AvatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/User/ProfileManagement/SaveDiceBearAvatarUseCase";
import { GetUserProfileUseCase } from "../../Application/UseCases/User/ProfileManagement/GetUserProfileUseCase";
import SendFriendRequestUseCase from "../../Application/UseCases/User/FriendManagement/SendFriendRequestUseCase";
import AcceptFriendRequestUseCase from "../../Application/UseCases/User/FriendManagement/AcceptFriendRequestUseCase";
import GetFriendsListUseCase from "../../Application/UseCases/User/FriendManagement/GetFriendsListUseCase";
import SearchUsersUseCase from "../../Application/UseCases/User/FriendManagement/SearchUsersUseCase";
import GetPendingRequestsUseCase from "../../Application/UseCases/User/FriendManagement/GetPendingRequestsUseCase";

import { TokenService } from "../Services/TokenService";
import {  HashService } from "../Services/PasswordHashing";
import { S3StorageService } from "../Services/S3Service";

import {GameModel} from "../Database/Model/GameModel";
import { StockfishService } from "../../Domain/Chess/Service/StockfishService";

import { UserRoutes } from "../../Presentation/Routes/UserRoute";


import { LeaderBoardRepository } from "../Repository/LeaderBoardRepository";
import { GetLeaderBoardUseCase } from "../../Application/UseCases/User/LeaderBoard/GetLeaderBoardUseCase";
import { LeaderBoardController } from "../../Presentation/Controllers/User/LeaderBoard/LeaderBoardController";

const UserRepo = new UserManagementRepository();
const GameRepo = new ChessGameRepository(GameModel);
const PuzzleRepo = new PuzzleManagementRepository();
const ProgressPuzzleRepo = new UserPuzzleProgressRepository();
const LeaderRepo = new LeaderBoardRepository();
const FriendshipRepo = new FriendshipRepository();

//service
const tokenService = new TokenService();
const hashService = new HashService();
const S3Service = new S3StorageService();
const stockfishService = new StockfishService();

//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo, hashService);
const getAvatarUrlUseCase = new GetAvatarUrlUseCase(S3Service);
const saveDiceBearAvatarUseCase = new SaveDiceBearAvatarUseCase(
  S3Service,
  UserRepo,
);
const getUserProfileUseCase = new GetUserProfileUseCase(UserRepo, S3Service);
const createGameUseCase = new CreateGameUseCase(GameRepo);
const getGameUseCase = new GetGameUseCase(GameRepo, UserRepo, S3Service);
const getLegalMovesUseCase = new GetLegalMovesUseCase(GameRepo);
const makeMoveUseCase = new MakeMoveUsecase(GameRepo);
const getpuzzleUseCase = new GetPuzzleDifficultyUsecase(PuzzleRepo);
const validatePuzzleUsecase = new ValidatePuzzlesMoves(
  PuzzleRepo,
  ProgressPuzzleRepo,
);
const reviewGameUseCase = new ReviewGameUseCase(GameRepo, stockfishService);
const getLeaderBoardUseCase = new GetLeaderBoardUseCase(LeaderRepo, S3Service);

const sendFriendRequestUseCase = new SendFriendRequestUseCase(FriendshipRepo, UserRepo);
const acceptFriendRequestUseCase = new AcceptFriendRequestUseCase(FriendshipRepo);
const getFriendsListUseCase = new GetFriendsListUseCase(FriendshipRepo, UserRepo, S3Service);
const searchUsersUseCase = new SearchUsersUseCase(UserRepo, S3Service);
const getPendingRequestsUseCase = new GetPendingRequestsUseCase(FriendshipRepo, UserRepo, S3Service);

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
);
export const userPuzzleController = new UserPuzzleController(
  getpuzzleUseCase,
  validatePuzzleUsecase,
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
);
export const userRoutes = new UserRoutes(tokenService);
