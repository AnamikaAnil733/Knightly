import { UserManagmentRepository } from "../Repository/UserManagmentRepository";

import { GetAllUserController } from "../../Presentation/controllers/admin/userManagment/findallUserController";
import {  BlockUserController }  from "../../Presentation/controllers/admin/userManagment/blockUserController";
import {  UnBlockUserController } from "../../Presentation/controllers/admin/userManagment/unBlockUserController";

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/getAllUserUseCase";
import { BlockUserUseCase } from "../../Application/UseCases/admin/blockUserUseCase";
import { UnBlockUserUseCase } from "../../Application/UseCases/admin/unBlockUserUseCase";


const UserManagmentRepo = new UserManagmentRepository()

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);
const blockUserUseCase = new BlockUserUseCase(UserManagmentRepo)
const unBlockUserUserCase = new UnBlockUserUseCase(UserManagmentRepo)



export const getAllUserController = new GetAllUserController(getAllUsersUseCase);
export const banUserController = new BlockUserController(blockUserUseCase);
export const unBanUserController = new UnBlockUserController(unBlockUserUserCase);
