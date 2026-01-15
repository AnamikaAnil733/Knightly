import { UserManagmentRepository } from "../Repository/UserRepository";

import { EditProfileController } from "../../Presentation/controllers/User/profileManagement/updateProfileController";

import {  EditUserUseCase } from "../../Application/UseCases/user/profileManagement/editUseCase";

import { TokenService } from "../services/tokenService";
import { UserRoutes } from "../../Presentation/routes/userroute";


const UserRepo = new UserManagmentRepository()


//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);

//service
const tokenService = new TokenService()


export const editUserController = new EditProfileController(editUserUseCase);
export const userRoutes = new UserRoutes(tokenService);


