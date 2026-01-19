import { UserManagmentRepository } from "../Repository/UserRepository";

import { GetAllUserController } from "../../Presentation/controllers/admin/userManagement/findallUserController";
import {  BlockUserController }  from "../../Presentation/controllers/admin/userManagement/blockUserController";
import {  UnBlockUserController } from "../../Presentation/controllers/admin/userManagement/unBlockUserController";

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/UserManagement/getAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/blockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/unBlockUserUseCase";

import { TokenService } from "../services/tokenService";

import {AdminRoutes} from "../../Presentation/routes/adminroute"

const UserManagmentRepo = new UserManagmentRepository();

//service
const tokenService = new TokenService()

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagmentRepo);
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagmentRepo);


export const getAllUserController = new GetAllUserController(getAllUsersUseCase);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(unBlockUserUserCase);
export const adminRoutes = new AdminRoutes(tokenService);
