import { Router } from "express";
import { getAllUserController,banUserController,unBanUserController} from "../../Infrastructure/Composition/AdminCompostion";
import { authMiddleware } from "../Middleware/authMiddleware";
import { ITokenService } from "../../Domain/Interface/service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { ADMIN_ROUTES } from "../constants/Routes/adminRoutes";


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
    this.router.get(ADMIN_ROUTES.USERS,getAllUserController.getallusers);
    this.router.patch(ADMIN_ROUTES.BAN_USER,banUserController.handleUserBan);
    this.router.patch(ADMIN_ROUTES.UNBAN_USER,unBanUserController.handleUserUnBan);
  }
}
