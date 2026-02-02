import { Router } from "express";
import { 
  editUserController, 
  changePasswordController,
  avatarController ,
  gameController, 
} 
  from "../../Infrastructure/Composition/UserCompostion";
import { authMiddleware } from "../Middleware/authMiddleware";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { USER_ROUTES } from "../constants/Routes/userRoutes";

export class UserRoutes{
  public readonly router:Router;
  constructor(tokenService: ITokenService){
    this.router = Router();
    this.router.use(
      authMiddleware([UserRole.USER],tokenService),
    );

    this.initializeRoutes();
  }

  private initializeRoutes(){
    this.router.patch(USER_ROUTES.EDIT_PROFILE,editUserController.handleEditProfile);
    this.router.patch(USER_ROUTES.CHANGE_PASSWORD,changePasswordController.handleChangePassword);
    this.router.post(USER_ROUTES.AVATAR.UPLOAD,avatarController.getAvatarUrl);
    this.router.post(USER_ROUTES.AVATAR.DICEBEAR,avatarController.saveDiceBearAvatar);
    this.router.get(USER_ROUTES.PROFILE,avatarController.getProfile);
    this.router.post(USER_ROUTES.CREATE_GAME,gameController.createGame);
    this.router.get(USER_ROUTES.GET_GAME,gameController.getGame);
    this.router.get(USER_ROUTES.LEGAL_MOVES,gameController.legalMove);
    this.router.post(USER_ROUTES.MAKE_MOVE,gameController.makeMove);

  }
}
