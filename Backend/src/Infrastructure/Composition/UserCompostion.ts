import { UserManagmentRepository } from "../Repository/UserRepository";

import { EditProfileController } from "../../Presentation/controllers/User/profileManagement/updateProfileController";
import { ChangePassswordController } from "../../Presentation/controllers/User/profileManagement/changePasswordController";

import {  EditUserUseCase } from "../../Application/UseCases/user/profileManagement/editUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/user/profileManagement/changePasswordUseCase";

import { TokenService } from "../services/tokenService";
import {  HashService } from "../services/passwordHashing";

import { UserRoutes } from "../../Presentation/routes/userroute";


const UserRepo = new UserManagmentRepository();

//service
const tokenService = new TokenService();
const hashService = new HashService();


//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo,hashService)




export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(changePasswordUseCase)
export const userRoutes = new UserRoutes(tokenService);


