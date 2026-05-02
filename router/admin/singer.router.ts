import { Router } from "express";
const router: Router = Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controller/admin/singer.controller";
import * as uploadCloud from "../../middleware/admin/uploadImage.middleware";
import * as validator from "../../validator/admin.validator";
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create", 
    upload.single("avatar"), 
    uploadCloud.uploadSingle,
    validator.createSinger, 
    controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.single("avatar"), 
    uploadCloud.uploadSingle,
    validator.createSinger, 
    controller.editPatch
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleted);

export const RouterSinger: Router = router;