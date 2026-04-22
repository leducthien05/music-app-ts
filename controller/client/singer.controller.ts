import { Request, Response } from "express";
import Singer from "../../model/singer.model";

// [GET] /singers
export const index = async (req: Request, res: Response)=>{
    const singer = await Singer.find({
        deleted: false,
        status: "active"
    });
    res.send("OK");
}