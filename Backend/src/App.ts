import "dotenv/config";

import { corsOptions } from "./Presentation/Constants/CorsOption";
import express, { Application } from "express";
import http from "http";
import {Server} from "socket.io";
import { MongoDB } from "./Infrastructure/Database/Mongodbconnection";
import { AuthRoutes } from "./Presentation/Routes/AuthRoute";
import { userRoutes, achievementServiceLive } from "./Infrastructure/Composition/UserComposition";
import { adminRoutes } from "./Infrastructure/Composition/AdminComposition";
import { SocketHandler } from "./Infrastructure/Socket/SocketHandler";
import { paymentRoutes } from "./Infrastructure/Composition/PaymentComposition";
import { RatingUpdateService } from "./Domain/Chess/Service/RatingUpdateService";
import { StockfishService } from "./Domain/Chess/Service/StockfishService";

import { MakeMoveUsecase } from "./Application/UseCases/User/GameManagement/MakeMoveUseCase";
import { CreateGameUseCase } from "./Application/UseCases/User/GameManagement/CreateGameUseCase";
import { MatchmakingUseCase } from "./Application/UseCases/User/GameManagement/MatchmakingUseCase";
import { ChessGameRepository } from "./Infrastructure/Repository/GameRepository";
import { AuthRepository } from "./Infrastructure/Repository/AuthRepository";
import { GameModel } from "./Infrastructure/Database/Model/GameModel";

import { createAdapter } from "@socket.io/redis-adapter";
import { redisClient, subClient ,connectRedis } from "./Infrastructure/Redis/RedisClient";

import { errorHandler } from "./Presentation/Middleware/ErrorHandlingMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import { maintenanceMiddleware } from "./Presentation/Middleware/MaintenanceMiddleware";
import { settingsRepo, tokenservice } from "./Infrastructure/Composition/AuthComposition";

export class App {
  private app: Application;
  private _server: http.Server;
  private _io: Server;
  private _socketHandler: SocketHandler | null = null;

  constructor() {
    this.app = express();
    this._server = http.createServer(this.app);

    this._io = new Server(this._server, {
      cors: {
        origin: process.env.ORIGIN_URL,
        methods: ["GET", "POST"],
      },
    });

    this._io.adapter(createAdapter(redisClient, subClient));

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.setErrorHandlerMiddleware();
  }

  public async init(): Promise<void> {
    try {
      console.log("Initializing databases...");
      await MongoDB.connect();
      await connectRedis();
      console.log("Databases initialized successfully.");

      const gameRepo = new ChessGameRepository(GameModel);
      const makeMoveUseCase = new MakeMoveUsecase(gameRepo);
      const createGameUseCase = new CreateGameUseCase(gameRepo);
      const matchmakingUseCase = new MatchmakingUseCase(createGameUseCase);
      const authRepo = new AuthRepository();
      const ratingUpdateService = new RatingUpdateService(authRepo, achievementServiceLive);
      const stockfishService = new StockfishService();

      this._socketHandler = new SocketHandler(
        this._io,
        makeMoveUseCase,
        gameRepo,
        matchmakingUseCase,
        createGameUseCase,
        authRepo,
        ratingUpdateService,
        stockfishService,
      );
      this._socketHandler.initialize();
      console.log("Socket handler initialized.");
    } catch (error) {
      console.error("Failed to initialize App:", error);
      throw error;
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(
      express.json({
        verify: (req: any, res, buf) => {
          req.rawBody = buf;
        },
      }),
    );
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(maintenanceMiddleware(settingsRepo, tokenservice));
  }

  private initializeRoutes(): void {
    const authRoutes = new AuthRoutes();
    this.app.use("/api/auth", authRoutes.router);
    this.app.use("/api/admin", adminRoutes.router);
    this.app.use("/api/user", userRoutes.router);
    this.app.use("/api/payment", paymentRoutes.router);
  }

  private setErrorHandlerMiddleware() {
    this.app.use(errorHandler);
  }

  public listen(port: any): void {
    this._server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
}

const app = new App();
app.init()
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.error("App startup failed:", err);
    process.exit(1);
  });
