import { Router } from "express";
import { editUserController } from "../../Infrastructure/Composition/UserCompostion";
import { authMiddleware } from "../Middleware/authMiddleware";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";

export class UserRoutes{
    public readonly router:Router;
    constructor(tokenService: ITokenService){
      this.router = Router();
      this.router.use(
        authMiddleware([UserRole.USER],tokenService)
      );

      this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.patch("/edit-profile",editUserController.handleEditProfile)
    }
}