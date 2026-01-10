
import { UserManagmentRepository } from "../Repository/UserManagmentRepository";
import { GetAllUserController } from "../../Presentation/controllers/admin/userManagment/findallUserController";

import { GetAllUserUseCase }  from "../../Application/UseCases/admin/getAllUserUseCase";

const UserManagmentRepo = new UserManagmentRepository()

//useCase
const getAllUsersUseCase = new GetAllUserUseCase(UserManagmentRepo);

export const getAllUserController = new GetAllUserController(
    getAllUsersUseCase,
)