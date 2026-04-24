import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/song.controller";
import { authMiddleware } from "../../middleware/client/auth.middleware";

router.get("/", controller.index);
router.get("/:slugTopic", controller.listByTopic);
router.get("/detail/:slugSong", controller.detail);
router.patch("/like/:action/:id", authMiddleware, controller.like);
router.post("/favorite/:action/:id", authMiddleware, controller.favorite);
export const RouterSong: Router = router;