import { Router } from "express";
import { getAllUserController } from "../../Infrastructure/Composition/AdminCompostion";


export class AdminRoutes{
    public readonly router :Router;

    constructor(){
        this.router = Router();
        this.initializeRoutes();
    }

    private  initializeRoutes(){
        this.router.get("/users",getAllUserController.getallusers)
    }
}