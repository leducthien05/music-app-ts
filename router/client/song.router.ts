import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/song.controller";

router.get("/", controller.index);
router.get("/:slugTopic", controller.listByTopic);
router.get("/detail/:slugSong", controller.detail);
router.patch("/like/:action/:id", controller.like);

export const RouterSong: Router = router;