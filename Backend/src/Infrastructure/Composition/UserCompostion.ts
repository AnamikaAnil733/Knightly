import { UserManagmentRepository } from "../Repository/UserRepository";

import { EditProfileController } from "../../Presentation/controllers/User/profileManagement/updateProfileController";
import { ChangePassswordController } from "../../Presentation/controllers/User/profileManagement/changePasswordController";
import { AvatarController } from "../../Presentation/controllers/User/profileManagement/avatarController"

import {  EditUserUseCase } from "../../Application/UseCases/user/profileManagement/editUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/user/profileManagement/changePasswordUseCase";
import { UpdateAvatarUseCase } from "../../Application/UseCases/user/profileManagement/avatarUpdateUseCase";
import { GetAvatarUrlUseCase } from "../../Application/UseCases/user/profileManagement/avatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/user/profileManagement/SaveDiceBearAvatarUseCase";

import { TokenService } from "../services/tokenService";
import {  HashService } from "../services/passwordHashing";
import { S3StorageService } from "../services/S3Service";

import { UserRoutes } from "../../Presentation/routes/userroute";


const UserRepo = new UserManagmentRepository();

//service
const tokenService = new TokenService();
const hashService = new HashService();
const S3Service = new S3StorageService();


//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo,hashService);
const getAvatarUrlUseCase = new GetAvatarUrlUseCase(S3Service)
const updateAvatarUseCase = new UpdateAvatarUseCase(UserRepo)
const saveDiceBearAvatarUseCase = new SaveDiceBearAvatarUseCase( S3Service,UserRepo)


export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(changePasswordUseCase)
export const avatarController = new AvatarController(getAvatarUrlUseCase,updateAvatarUseCase,saveDiceBearAvatarUseCase)
export const userRoutes = new UserRoutes(tokenService);

