import dotenv from "dotenv";
dotenv.config();

import { corsOptions } from "../src/Presentation/constants/corsOption";
import express, { Application } from "express";
import { MongoDB } from "../src/Infrastructure/database/mongodbconnection";
import { AuthRoutes } from "../src/Presentation/routes/authroute";
import { AdminRoutes } from "../src/Presentation/routes/adminroute";

import {userRoutes} from "./Infrastructure/Composition/UserCompostion";

import { errorHandler }from "../src/Presentation/Middleware/errorHandlingMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
    this.setErrorHandlerMiddleware();
  }
  private initializeMiddlewares(): void {
    this.app.use(cors(corsOptions));

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async initializeDatabase(): Promise<void> {
    await MongoDB.connect();
  }


  private initializeRoutes(): void {
    const authRoutes = new AuthRoutes();
    this.app.use("/api/auth", authRoutes.router);

    const adminRoutes = new AdminRoutes();
    this.app.use("/api/admin",adminRoutes.router);


    this.app.use("/api/user",userRoutes.router);
  }

  private setErrorHandlerMiddleware() {
    this.app.use(errorHandler);
  }

  public listen(port:any): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

const app = new App();
app.listen(process.env.PORT);
