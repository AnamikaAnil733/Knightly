import { Router } from "express";
import { getAllUserController,banUserController,unBanUserController} from "../../Infrastructure/Composition/AdminCompostion";
import { authMiddleware } from "../Middleware/authMiddleware";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";


export class AdminRoutes{
  public readonly router :Router;

  constructor(tokenService: ITokenService){
    this.router = Router();
        this.router.use(
          authMiddleware([UserRole.ADMIN],tokenService),
        );
    this.initializeRoutes();
  }

  private  initializeRoutes(){
    this.router.get("/users",getAllUserController.getallusers);
    this.router.patch("/users/ban/:userId",banUserController.handleUserBan);
    this.router.patch("/users/unban/:userId",unBanUserController.handleUserUnBan);
  }
}
