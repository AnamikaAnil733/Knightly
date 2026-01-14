import { UserManagmentRepository } from "../Repository/UserManagmentRepository";

import { GetAllUserController } from "../../Presentation/controllers/admin/userManagement/findallUserController";
import {  BlockUserController }  from "../../Presentation/controllers/admin/userManagement/blockUserController";
import {  UnBlockUserController } from "../../Presentation/controllers/admin/userManagement/unBlockUserController";

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/UserManagement/getAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/blockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/admin/UserManagement/unBlockUserUseCase";


const UserManagmentRepo = new UserManagmentRepository()

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagmentRepo)
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagmentRepo)



export const getAllUserController = new GetAllUserController(getAllUsersUseCase);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(unBlockUserUserCase);
