import { UserManagmentRepository } from "../Repository/UserRepository";
import { ChessGameRepository } from "../Repository/GameRepository";
import { UserPuzzleProgressRepository } from "../Repository/UserPuzzleProgressRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { EditProfileController } from "../../Presentation/Controllers/User/profileManagement/updateProfileController";
import { ChangePassswordController } from "../../Presentation/Controllers/User/profileManagement/changePasswordController";
import { AvatarController } from "../../Presentation/Controllers/User/profileManagement/avatarController";
import { GameController } from "../../Presentation/Controllers/User/gameManagement.ts/GameController";
import { UserPuzzleController } from "../../Presentation/Controllers/User/puzzleManagement/puzzleController";

import {  EditUserUseCase } from "../../Application/UseCases/User/ProfileManagement/editUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/User/ProfileManagement/changePasswordUseCase";
import { CreateGameUseCase } from "../../Application/UseCases/User/GameManagement/createGameUseCase";
import { GetGameUseCase } from "../../Application/UseCases/User/GameManagement/getGameUseCase";
import { MakeMoveUsecase } from "../../Application/UseCases/User/GameManagement/makeMoveUseCase";
import { GetLegalMovesUseCase } from "../../Application/UseCases/User/GameManagement/getLegalMovesUseCase";

import { GetPuzzleDifficultyUsecase } from "../../Application/UseCases/User/PuzzleManagement/GetPuzzleByDiffiicultyUseCase";
import { ValidatePuzzlesMoves } from "../../Application/UseCases/User/PuzzleManagement/ValidatePuzzleUseCase";

import { GetAvatarUrlUseCase } from "../../Application/UseCases/User/ProfileManagement/avatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/User/ProfileManagement/SaveDiceBearAvatarUseCase";
import { GetUserProfileUseCase } from "../../Application/UseCases/User/ProfileManagement/GetUserProfileUseCase";

import { TokenService } from "../Services/TokenService";
import {  HashService } from "../Services/PasswordHashing";
import { S3StorageService } from "../Services/S3Service";

import {GameModel} from "../Database/Model/GameModel";

import { UserRoutes } from "../../Presentation/Routes/userroute";


const UserRepo = new UserManagmentRepository();
const GameRepo = new ChessGameRepository(GameModel);
const PuzzleRepo = new PuzzleManagementRepository();
const ProgressPuzzleRepo = new UserPuzzleProgressRepository();

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
const validatePuzzleUsecase = new ValidatePuzzlesMoves(PuzzleRepo,ProgressPuzzleRepo);


export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(changePasswordUseCase);
export const avatarController = new AvatarController(getAvatarUrlUseCase,getUserProfileUseCase,saveDiceBearAvatarUseCase);
export const gameController = new GameController(
  createGameUseCase,
  getGameUseCase,
  getLegalMovesUseCase,
  makeMoveUseCase,
);
export const userPuzzleController = new UserPuzzleController(getpuzzleUseCase,validatePuzzleUsecase);
export const userRoutes = new UserRoutes(tokenService);

