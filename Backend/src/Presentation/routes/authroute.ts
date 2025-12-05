import { Router } from "express";
import { authController } from "../../Composition/AuthComposition";

const router = Router();

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/register", authController.register);

export default router;
