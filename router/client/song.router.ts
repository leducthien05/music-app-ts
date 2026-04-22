import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/song.controller";

router.get("/", controller.index);
router.get("/:slugTopic", controller.listByTopic);

export const RouterSong: Router = router;