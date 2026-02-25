import { UserManagmentRepository } from "../Repository/UserRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { GetAllUserController } from "../../Presentation/controllers/admin/userManagement/findallUserController";
import {  BlockUserController }  from "../../Presentation/controllers/admin/userManagement/blockUserController";
import {  UnBlockUserController } from "../../Presentation/controllers/admin/userManagement/unBlockUserController";
import { AdminPuzzleController } from "../../Presentation/controllers/admin/puzzleManagment/puzzleManagementAdmin";

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/UserManagement/getAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/blockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/unBlockUserUseCase";
import { CreatePuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/CreatePuzzleUseCase";
import { GetallPuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/getAllPuzzleUseCase";
import { EditPuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/EditPuzzleUseCase";
import { SoftDeletePuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/DeletePuzzleUseCase";

import { TokenService } from "../services/tokenService";
import { PuzzleValidationService } from "../services/PuzzleValidationService";

import {AdminRoutes} from "../../Presentation/routes/adminroute";

const UserManagmentRepo = new UserManagmentRepository();
const puzzleMangementRepo = new PuzzleManagementRepository();

//service
const tokenService = new TokenService();
const puzzleValidationService = new PuzzleValidationService();

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagmentRepo);
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagmentRepo);
const createPuzzleUseCase = new CreatePuzzleUseCase(puzzleMangementRepo,puzzleValidationService);
const getAllPuzzleUseCase = new GetallPuzzleUseCase(puzzleMangementRepo);
const editPuzzleUseCase = new EditPuzzleUseCase(puzzleMangementRepo,puzzleValidationService);
const softDeletePuzzleUseCase = new SoftDeletePuzzleUseCase(puzzleMangementRepo);


export const getAllUserController = new GetAllUserController(getAllUsersUseCase);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(unBlockUserUserCase);

export const PuzzleManagementController = new AdminPuzzleController(
  createPuzzleUseCase,
  getAllPuzzleUseCase,
  editPuzzleUseCase,
  softDeletePuzzleUseCase,
);

export const adminRoutes = new AdminRoutes(tokenService);
