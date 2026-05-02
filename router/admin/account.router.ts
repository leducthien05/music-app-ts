import { Router } from "express";
const router: Router = Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controller/admin/account.controller";
import * as uploadCloud from "../../middleware/admin/uploadImage.middleware";
import * as validator from "../../validator/admin.validator";
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create", 
    upload.single("avatar"), 
    uploadCloud.uploadSingle,
    validator.createSong, 
    controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.single("avatar"), 
    uploadCloud.uploadSingle,
    validator.editAccount, 
    controller.editPatch
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleted);

export const RouterAccount: Router = router;