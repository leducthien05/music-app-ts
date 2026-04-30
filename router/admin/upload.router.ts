import { Router } from "express";
const router: Router = Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controller/admin/upload.controller";
import * as uploadCloud from "../../middleware/admin/uploadImage.middleware";
router.get("/", controller.index);

router.post(
    "/", 
    upload.single("file"), 
    uploadCloud.uploadSingle,
    controller.index
);

export const RouterUpload: Router = router;