import { AuthRepository } from "../Repository/AuthRepository";
import StripeService from "../Services/StripeService";
import CreateCheckoutSessionUseCase from "../../Application/UseCases/Payment/CreateCheckoutSessionUseCase";
import StripeWebhookUseCase from "../../Application/UseCases/Payment/StripeWebhookUseCase";
import VerifySessionUseCase from "../../Application/UseCases/Payment/VerifySessionUseCase";
import PaymentController from "../../Presentation/Controllers/User/PaymentController";
import { authMiddleware } from "../../Presentation/Middleware/AuthMiddleware";
import { TokenService } from "../Services/TokenService";
import { UserRole } from "../../Domain/Types/UserRole";
import express from "express";

import { TransactionRepository } from "../Repository/TransactionRepository";

const authRepository = new AuthRepository();
const stripeService = new StripeService();
const tokenService = new TokenService();
const transactionRepository = new TransactionRepository();

const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(stripeService, authRepository as any);
const stripeWebhookUseCase = new StripeWebhookUseCase(stripeService, authRepository as any, transactionRepository);
const verifySessionUseCase = new VerifySessionUseCase(stripeService, authRepository as any);

const paymentController = new PaymentController(
  createCheckoutSessionUseCase,
  stripeWebhookUseCase,
  verifySessionUseCase,
);

const router = express.Router();

// Protected routes (require auth)
router.post(
  "/create-checkout-session",
  authMiddleware([UserRole.USER], tokenService) as any,
  (req: any, res: any) => paymentController.createCheckoutSession(req, res),
);

router.post(
  "/verify-session",
  authMiddleware([UserRole.USER], tokenService) as any,
  (req: any, res: any, next: any) => paymentController.verifySession(req, res, next),
);

// Stripe sends raw body — must be BEFORE any global json parsing touches this route
router.post("/webhook", express.raw({ type: "application/json" }), (req: any, res: any) =>
  paymentController.handleWebhook(req, res),
);

export const paymentRoutes = { router };
