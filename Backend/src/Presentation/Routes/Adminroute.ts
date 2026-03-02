import { Router } from "express";
import { getAllUserController,
  banUserController,
  unBanUserController,
  PuzzleManagementController,
} from "../../Infrastructure/Composition/AdminCompostion";
import { authMiddleware } from "../Middleware/AuthMiddleware";
import { ITokenService } from "../../Domain/Interface/Service/ITokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { ADMIN_ROUTES } from "../Constants/Routes/AdminRoutes";


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

    this.router.post(ADMIN_ROUTES.CREATEPUZZLES,PuzzleManagementController.createPuzzle);
    this.router.get(ADMIN_ROUTES.PUZZLES,PuzzleManagementController.getAllPuzzles);
    this.router.patch(ADMIN_ROUTES.EDITPUZZLE,PuzzleManagementController.editPuzzles);
    this.router.delete(ADMIN_ROUTES.DELETEPUZZLE,PuzzleManagementController.softDeletePuzzle);
  }
}
