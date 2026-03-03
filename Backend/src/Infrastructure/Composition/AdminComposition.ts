import { UserManagementRepository } from "../Repository/UserRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { GetAllUserController } from "../../Presentation/Controllers/Admin/UserManagement/FindallUserController";
import {  BlockUserController }  from "../../Presentation/Controllers/Admin/UserManagement/BlockUserController";
import {  UnBlockUserController } from "../../Presentation/Controllers/Admin/UserManagement/UnBlockUserController";
import { AdminPuzzleController } from "../../Presentation/Controllers/Admin/PuzzleManagement/PuzzleManagementAdmin";

import { GetAllUserUseCase }  from "../../Application/UseCases/Admin/UserManagement/GetAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/BlockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/UnBlockUserUseCase";
import { CreatePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/CreatePuzzleUseCase";
import { GetallPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/GetAllPuzzleUseCase";
import { EditPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/EditPuzzleUseCase";
import { SoftDeletePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagement/DeletePuzzleUseCase";

import { TokenService } from "../Services/TokenService";
import { PuzzleValidationService } from "../Services/PuzzleValidationService";

import {AdminRoutes} from "../../Presentation/Routes/AdminRoute";

const UserManagementRepo = new UserManagementRepository();
const puzzleMangementRepo = new PuzzleManagementRepository();

//service
const tokenService = new TokenService();
const puzzleValidationService = new PuzzleValidationService();

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagementRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagementRepo);
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagementRepo);
const createPuzzleUseCase = new CreatePuzzleUseCase(
  puzzleMangementRepo,
  puzzleValidationService
);
const getAllPuzzleUseCase = new GetallPuzzleUseCase(puzzleMangementRepo);
const editPuzzleUseCase = new EditPuzzleUseCase(
  puzzleMangementRepo,
  puzzleValidationService
);
const softDeletePuzzleUseCase = new SoftDeletePuzzleUseCase(
  puzzleMangementRepo
);

export const getAllUserController = new GetAllUserController(
  getAllUsersUseCase
);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(
  unBlockUserUserCase
);

export const PuzzleManagementController = new AdminPuzzleController(
  createPuzzleUseCase,
  getAllPuzzleUseCase,
  editPuzzleUseCase,
  softDeletePuzzleUseCase
);

export const adminRoutes = new AdminRoutes(tokenService);
