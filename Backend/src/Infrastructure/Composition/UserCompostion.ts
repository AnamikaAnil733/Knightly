import { UserManagmentRepository } from "../Repository/UserRepository";

import { EditProfileController } from "../../Presentation/controllers/User/profileManagement/updateProfileController";
import { ChangePassswordController } from "../../Presentation/controllers/User/profileManagement/changePasswordController";
import { AvatarController } from "../../Presentation/controllers/User/profileManagement/avatarController"

import {  EditUserUseCase } from "../../Application/UseCases/user/profileManagement/editUseCase";
import { ChangePasswordUseCase } from "../../Application/UseCases/user/profileManagement/changePasswordUseCase";

import { GetAvatarUrlUseCase } from "../../Application/UseCases/user/profileManagement/avatarUseCase";
import { SaveDiceBearAvatarUseCase } from "../../Application/UseCases/user/profileManagement/SaveDiceBearAvatarUseCase";
import { GetUserProfileUseCase } from "../../Application/UseCases/user/profileManagement/GetUserProfileUseCase"

import { TokenService } from "../services/tokenService";
import {  HashService } from "../services/passwordHashing";
import { S3StorageService } from "../services/S3Service";

import { UserRoutes } from "../../Presentation/routes/userroute";
import { S3 } from "@aws-sdk/client-s3";


const UserRepo = new UserManagmentRepository();

//service
const tokenService = new TokenService();
const hashService = new HashService();
const S3Service = new S3StorageService();


//usecase
const editUserUseCase = new EditUserUseCase(UserRepo);
const changePasswordUseCase = new ChangePasswordUseCase(UserRepo,hashService);
const getAvatarUrlUseCase = new GetAvatarUrlUseCase(S3Service)
const saveDiceBearAvatarUseCase = new SaveDiceBearAvatarUseCase( S3Service,UserRepo)
const getUserProfileUseCase = new GetUserProfileUseCase(UserRepo,S3Service)


export const editUserController = new EditProfileController(editUserUseCase);
export const changePasswordController = new ChangePassswordController(changePasswordUseCase)
export const avatarController = new AvatarController(getAvatarUrlUseCase,getUserProfileUseCase,saveDiceBearAvatarUseCase)
export const userRoutes = new UserRoutes(tokenService);

