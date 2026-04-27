import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/dashboard.controller";

router.get("/", controller.dashboard);
// router.get("/result", controller.result);
// router.get("/suggest", controller.suggest);

export const RouterDashboard: Router = router;