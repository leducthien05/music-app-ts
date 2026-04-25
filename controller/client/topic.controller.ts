import { Request, Response } from "express";
import Topic from "../../model/topics.model";

// [GET] /topics
export const index = async (req: Request, res: Response) => {
    const topic = await Topic.find({
        deleted: false,
        status: "active"
    });
    res.render("client/page/topics/index", {
        titlePage: "Thể loại nhạc",
        topic: topic
    });
}