import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import { MongoDB } from "../src/Infrastructure/database/mongodbconnection";
import { AuthRoutes } from "../src/Presentation/routes/authroute";
import cors from "cors";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({
      origin: "http://localhost:5173",
      credentials: true,
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private async initializeDatabase(): Promise<void> {
    await MongoDB.connect();
  }
  

  private initializeRoutes(): void {
    const authRoutes = new AuthRoutes();
    this.app.use("/api/auth", authRoutes.router);
  }

  public listen(port:any): void {
    this.app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

const app = new App();
app.listen(process.env.PORT);
