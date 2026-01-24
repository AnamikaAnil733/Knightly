import { UserManagmentRepository } from "../Repository/UserRepository";
import { PuzzleManagementRepository } from "../Repository/PuzzleRepository";

import { GetAllUserController } from "../../Presentation/controllers/admin/userManagement/findallUserController";
import {  BlockUserController }  from "../../Presentation/controllers/admin/userManagement/blockUserController";
import {  UnBlockUserController } from "../../Presentation/controllers/admin/userManagement/unBlockUserController";
import { AdminPuzzleController } from "../../Presentation/controllers/admin/puzzleManagment/puzzleManagementAdmin"

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/UserManagement/getAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/blockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/unBlockUserUseCase";
import { CreatePuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/CreatePuzzleUseCase";
import { GetallPuzzleUseCase } from "../../Application/UseCases/admin/PuzzleManagment/getAllPuzzleUseCase";

import { TokenService } from "../services/tokenService";

import {AdminRoutes} from "../../Presentation/routes/adminroute"

const UserManagmentRepo = new UserManagmentRepository();
const puzzleMangementRepo = new PuzzleManagementRepository();

//service
const tokenService = new TokenService()

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagmentRepo);
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagmentRepo);
const createPuzzleUseCase = new CreatePuzzleUseCase(puzzleMangementRepo)
const getAllPuzzleUseCase = new GetallPuzzleUseCase(puzzleMangementRepo)


export const getAllUserController = new GetAllUserController(getAllUsersUseCase);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(unBlockUserUserCase);

export const PuzzleManagementController = new AdminPuzzleController(createPuzzleUseCase,getAllPuzzleUseCase);

export const adminRoutes = new AdminRoutes(tokenService);
