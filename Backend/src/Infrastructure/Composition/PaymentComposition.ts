import { AuthRepository } from "../Repository/AuthRepository";
import StripeService from "../Services/StripeService";
import CreateCheckoutSessionUseCase from "../../Application/UseCases/Payment/CreateCheckoutSessionUseCase";
import StripeWebhookUseCase from "../../Application/UseCases/Payment/StripeWebhookUseCase";
import PaymentController from "../../Presentation/Controllers/User/PaymentController";
import { authMiddleware } from "../../Presentation/Middleware/AuthMiddleware";
import { TokenService } from "../Services/TokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import { IBaseRepository } from "../../Domain/Interface/Repositories/IBaseRepository";
import EAuth from "../../Domain/Entity/Auth";
import express from "express";

const authRepository = new AuthRepository();
const stripeService = new StripeService();
const tokenService = new TokenService();

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(stripeService, authRepository);
const stripeWebhookUseCase = new StripeWebhookUseCase(stripeService, authRepository as any);

const paymentController = new PaymentController(createCheckoutSessionUseCase, stripeWebhookUseCase);

const router = express.Router();

router.post("/create-checkout-session", authMiddleware([UserRole.USER], tokenService) as any, (req: any, res: any) => paymentController.createCheckoutSession(req, res));
router.post("/webhook", express.raw({ type: "application/json" }), (req: any, res: any) => paymentController.handleWebhook(req, res));

export const paymentRoutes = { router };
