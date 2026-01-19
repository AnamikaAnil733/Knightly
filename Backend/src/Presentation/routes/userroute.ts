import { Router } from "express";
import { 
  editUserController, 
  changePasswordController,
  avatarController  
} 
  from "../../Infrastructure/Composition/UserCompostion";
import { authMiddleware } from "../Middleware/authMiddleware";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";

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
    this.router.patch("/edit-profile",editUserController.handleEditProfile);
    this.router.patch("/change-password",changePasswordController.handleChangePassword);
    this.router.post("/avatar/upload-avatar",avatarController.getAvatarUrl);
    this.router.post("/avatar/dicebear",avatarController.saveDiceBearAvatar);
    //  this.router.patch("/update-avatar",avatarController.updateAvatar);
    this.router.get("/profile",avatarController.getProfile)

  }
}
