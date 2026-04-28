import { Request, Response } from "express";

import Topic from "../../model/topics.model";

// [GET] /admin/topic
export const index = async (req: Request, res: Response)=>{
    const topic = await Topic.find({
        deleted: false
    });

    res.render("admin/page/topic/index", {
        titlePage: "Thể loại",
        topics: topic
    });
}