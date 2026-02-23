import { UserManagmentRepository } from "../Repository/UserRepository";
import { ChessGameRepository } from "../Repository/GameRepository";
import { UserPuzzleProgressRepository } from "../Repository/UserPuzzleProgressRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { EditProfileController } from "../../Presentation/controllers/User/profileManagement/updateProfileController";
import { ChangePassswordController } from "../../Presentation/controllers/User/profileManagement/changePasswordController";
import { AvatarController } from "../../Presentation/controllers/User/profileManagement/avatarController";
import { GameController } from "../../Presentation/controllers/User/gameManagement.ts/GameController";
import { UserPuzzleController } from "../../Presentation/controllers/User/puzzleManagement/puzzleController";

import {  EditUserUseCase } from "../../Application/UseCases/user/profileManagement/editUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/user/profileManagement/changePasswordUseCase";
import { CreateGameUseCase } from "../../Application/UseCases/user/gameManagement/createGameUseCase";
import { GetGameUseCase } from "../../Application/UseCases/user/gameManagement/getGameUseCase";
import { MakeMoveUsecase } from "../../Application/UseCases/user/gameManagement/makeMoveUseCase";
import { GetLegalMovesUseCase } from "../../Application/UseCases/user/gameManagement/getLegalMovesUseCase";

import { GetPuzzleDifficultyUsecase } from "../../Application/UseCases/user/puzzleManagement/GetPuzzleByDiffiicultyUseCase";
import { validatePuzzlesMoves } from "../../Application/UseCases/user/puzzleManagement/ValidatePuzzleUseCase";

import { GetAvatarUrlUseCase } from "../../Application/UseCases/user/profileManagement/avatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/user/profileManagement/SaveDiceBearAvatarUseCase";
import { GetUserProfileUseCase } from "../../Application/UseCases/user/profileManagement/GetUserProfileUseCase";

import { TokenService } from "../services/tokenService";
import {  HashService } from "../services/passwordHashing";
import { S3StorageService } from "../services/S3Service";

import {GameModel} from "../database/model/gameModel";

import { UserRoutes } from "../../Presentation/routes/userroute";


const UserRepo = new UserManagmentRepository();
const GameRepo = new ChessGameRepository(GameModel);
const PuzzleRepo = new PuzzleManagementRepository()
const ProgressPuzzleRepo = new UserPuzzleProgressRepository()

//service
const tokenService = new TokenService();
const hashService = new HashService();
const S3Service = new S3StorageService();


//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo,hashService);
const getAvatarUrlUseCase = new GetAvatarUrlUseCase(S3Service);
const saveDiceBearAvatarUseCase = new SaveDiceBearAvatarUseCase( S3Service,UserRepo);
const getUserProfileUseCase = new GetUserProfileUseCase(UserRepo,S3Service);
const createGameUseCase = new CreateGameUseCase(GameRepo);
const getGameUseCase = new GetGameUseCase(GameRepo, UserRepo, S3Service);
const getLegalMovesUseCase = new GetLegalMovesUseCase(GameRepo);
const makeMoveUseCase = new MakeMoveUsecase(GameRepo);
const getpuzzleUseCase = new GetPuzzleDifficultyUsecase(PuzzleRepo);
const validatePuzzleUsecase = new validatePuzzlesMoves(PuzzleRepo,ProgressPuzzleRepo) 


export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(changePasswordUseCase);
export const avatarController = new AvatarController(getAvatarUrlUseCase,getUserProfileUseCase,saveDiceBearAvatarUseCase);
export const gameController = new GameController(
  createGameUseCase,
  getGameUseCase,
  getLegalMovesUseCase,
  makeMoveUseCase,
);
export const userPuzzleController = new UserPuzzleController(getpuzzleUseCase,validatePuzzleUsecase)
export const userRoutes = new UserRoutes(tokenService);

