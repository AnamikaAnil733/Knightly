import { UserManagmentRepository } from "../Repository/UserRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { GetAllUserController } from "../../Presentation/Controllers/Admin/UserManagement/FindallUserController";
import {  BlockUserController }  from "../../Presentation/Controllers/Admin/UserManagement/BlockUserController";
import {  UnBlockUserController } from "../../Presentation/Controllers/Admin/UserManagement/UnBlockUserController";
import { AdminPuzzleController } from "../../Presentation/Controllers/Admin/PuzzleManagment/PuzzleManagementAdmin";

import { GetAllUserUseCase }  from "../../Application/UseCases/Admin/UserManagement/GetAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/BlockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/Admin/UserManagement/UnBlockUserUseCase";
import { CreatePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagment/CreatePuzzleUseCase";
import { GetallPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagment/GetAllPuzzleUseCase";
import { EditPuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagment/EditPuzzleUseCase";
import { SoftDeletePuzzleUseCase } from "../../Application/UseCases/Admin/PuzzleManagment/DeletePuzzleUseCase";

import { TokenService } from "../Services/TokenService";
import { PuzzleValidationService } from "../Services/PuzzleValidationService";

import {AdminRoutes} from "../../Presentation/Routes/Adminroute";

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
