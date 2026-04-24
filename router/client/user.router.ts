import { Router } from "express";
const router = Router();

import * as controller from "../../controller/client/user.controller";
import * as validator from "../../validator/auth.validator";

router.get("/login", controller.login);
router.post("/login", validator.login, controller.loginPost);
router.get("/register", controller.register);
router.post("/register", validator.register, controller.registerPost);
router.get("/forgot-password", controller.forgotPassword);
router.post("/forgot-password", validator.forgotPassword, controller.forgotPasswordPost);
router.get("/get-otp", controller.getOTP);
router.post("/get-otp", validator.getOTP, controller.getOTPPost);
router.get("/reset-password", controller.resetPassword);
router.post("/reset-password", validator.resetPassword, controller.resetPasswordPost);
router.get("/logout", controller.logout);

export const userRouter: Router = router;