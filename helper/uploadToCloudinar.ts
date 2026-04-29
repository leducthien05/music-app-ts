import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const streamUpload = (buffer: any) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            {
                folder: "music", // 👈 thêm folder
                resource_type: "auto"
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
