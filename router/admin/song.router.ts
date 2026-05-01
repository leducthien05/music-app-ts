import { Router } from "express";
const router: Router = Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controller/admin/song.controller";
import * as uploadCloud from "../../middleware/admin/uploadImage.middleware";
import * as validator from "../../validator/admin.validator";
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create", 
    upload.fields([  
        {name: "avatar", maxCount: 1},
        {name: "audio", maxCount: 1}
    ]), 
    uploadCloud.uploadMulti,
    validator.createSong, 
    controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.fields([  
        {name: "avatar", maxCount: 1},
        {name: "audio", maxCount: 1}
    ]), 
    uploadCloud.uploadMulti,
    validator.createSong, 
    controller.editPatch
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleted);

export const RouterSong: Router = router;