import { Router } from "express";
import { getAllUserController,banUserController,unBanUserController} from "../../Infrastructure/Composition/AdminCompostion";


export class AdminRoutes{
  public readonly router :Router;

  constructor(){
    this.router = Router();
    this.initializeRoutes();
  }

  private  initializeRoutes(){
    this.router.get("/users",getAllUserController.getallusers);
    this.router.patch("/users/ban/:userId",banUserController.handleUserBan);
    this.router.patch("/users/unban/:userId",unBanUserController.handleUserUnBan);
  }
}
