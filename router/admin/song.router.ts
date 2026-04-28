import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/song.controller";

router.get("/", controller.index);
// router.get("/result", controller.result);
// router.get("/suggest", controller.suggest);

export const RouterSong: Router = router;