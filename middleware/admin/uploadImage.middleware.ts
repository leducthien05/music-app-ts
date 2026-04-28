import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Request, Response, NextFunction } from "express";
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const streamUpload = (buffer: any) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            {
                folder: "shop/products", // 👈 thêm folder
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);

    });
}
export const uploadCloudinary = async (buffer: any) => {
    let result = await streamUpload(buffer);
    return result["url"];
}

export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await uploadCloudinary(req["file"].buffer);
        req.body[req["file"].fieldname] = result;
    } catch (error) {
        console.log(error);
    }
    next();
};

