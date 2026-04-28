import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/topic.controller";

router.get("/", controller.index);
// router.get("/result", controller.result);
// router.get("/suggest", controller.suggest);

export const RouterTopic: Router = router;