import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controller/admin/auth.controller";
import * as validator from "../../validator/admin.validator";
router.get("/login", controller.login);
router.post("/login", validator.login, controller.loginPost);
router.get("/logout", controller.logout);

export const RouterAuth: Router = router;