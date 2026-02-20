import dotenv from "dotenv";
dotenv.config();

import { corsOptions } from "../src/Presentation/constants/corsOption";
import express, { Application } from "express";
import http from "http";
import {Server} from "socket.io";
import { MongoDB } from "../src/Infrastructure/database/mongodbconnection";
import { AuthRoutes } from "../src/Presentation/routes/authroute";
import { userRoutes } from "./Infrastructure/Composition/UserCompostion";
import { adminRoutes } from "./Infrastructure/Composition/AdminCompostion";
import { SocketHandler } from "./Infrastructure/socket/SocketHandler";

import { MakeMoveUsecase } from "./Application/UseCases/user/gameManagement/makeMoveUseCase";
import { CreateGameUseCase } from "./Application/UseCases/user/gameManagement/createGameUseCase";
import { MatchmakingUseCase } from "./Application/UseCases/user/gameManagement/matchmakingUseCase";
import { ChessGameRepository } from "./Infrastructure/Repository/GameRepository";
import { AuthRepository } from "./Infrastructure/Repository/AuthRepository";
import { GameModel } from "./Infrastructure/database/model/gameModel";

import { errorHandler }from "../src/Presentation/Middleware/errorHandlingMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";

export class App {
  private app: Application;
  private _server:http.Server;
  private _io:Server;

  constructor() {
    this.app = express();
    this._server = http.createServer(this.app);

    this._io = new Server(this._server,{
      cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
      },
    });

    this.initializeMiddlewares();
    this.initializeDatabase();
    this.initializeRoutes();

    const gameRepo = new ChessGameRepository(GameModel);
    const makeMoveUseCase = new MakeMoveUsecase(gameRepo);
    
    // Matchmaking Setup
    const createGameUseCase = new CreateGameUseCase(gameRepo);
    const matchmakingUseCase = new MatchmakingUseCase(createGameUseCase);
    const authRepo = new AuthRepository();

    const socketHandler = new SocketHandler(
      this._io,
      makeMoveUseCase,
      gameRepo,
      matchmakingUseCase,
      authRepo as any
    );

    socketHandler.initialize();

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
    this.app.use("/api/admin",adminRoutes.router);
    this.app.use("/api/user",userRoutes.router);
  }

  private setErrorHandlerMiddleware() {
    this.app.use(errorHandler);
  }

  public listen(port:any): void {
    this._server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

const app = new App();
app.listen(process.env.PORT);
