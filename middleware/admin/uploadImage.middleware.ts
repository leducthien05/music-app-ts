import { uploadCloudinary } from "../../helper/uploadToCloudinar";
import { Request, Response, NextFunction } from "express";
export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await uploadCloudinary(req["file"].buffer);
        req.body[req["file"].fieldname] = result;
    } catch (error) {
        console.log(error);
    }
    next();
};

export const uploadMulti = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req["files"]);
    for(const key in req["files"]){
        req.body[key] = [];
        const array = req["files"][key];
        for(const item of array){
            try {
                const result = await uploadCloudinary(item.buffer);
                req.body[key].push(result);
            } catch (error) {
                console.log(error);
            }
        }
    }
    next();
}
