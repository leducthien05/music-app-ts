import { Router } from "express";
const router: Router = Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controller/admin/topic.controller";
import * as uploadImage from "../../middleware/admin/uploadImage.middleware";
import * as validate from "../../validator/admin.validator";

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/create", controller.create);
router.post(
    "/create", 
    upload.single("avatar"),
    uploadImage.uploadSingle,
    validate.createTopic,
    controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.single("avatar"),
    uploadImage.uploadSingle,
    validate.createTopic,
    controller.editPatch
);
router.delete("/delete/:id", controller.deleted);
export const RouterTopic: Router = router;