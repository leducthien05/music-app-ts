import { Request, Response } from "express";

import Topic from "../../model/topics.model";
import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";

// [GET] /admin/topic
export const index = async (req: Request, res: Response) => {
    const find = {
        deleted: false
    }
    // Phần trang
    const count = await Topic.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    if (req.query.keyword) {
        const objectSearch = search(req.query);
        const nameSong = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { nameSong: nameSong },
            { slug: textSlug }
        ];
    }
    const topic = await Topic.find(find).skip(objectPagination.skip).limit(objectPagination.limit);

    res.render("admin/page/topic/index", {
        titlePage: "Thể loại",
        topics: topic,
        pagination: objectPagination
    });
}