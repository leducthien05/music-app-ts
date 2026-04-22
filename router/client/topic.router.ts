import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/topic.controller";
router.get("/", controller.index);
export const RouterTopic: Router = router;