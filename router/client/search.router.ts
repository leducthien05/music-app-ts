import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/search.controller";

router.get("/", controller.index);
router.get("/result", controller.result);
router.get("/suggest", controller.suggest);

export const RouterResult: Router = router;