import { Request, Response } from "express";

import Topic from "../../model/topics.model";


import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";
import { filterStatus } from "../../helper/filterStatus";
import { systemConfig } from "../../config/system";

// [GET] /admin/topic
export const index = async (req: Request, res: Response) => {
    const find = {
        deleted: false
    }
    // Lọc theo trạng thái
    const filter = filterStatus(req.query);
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    // Phần trang
    const count = await Topic.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    const objectSearch = search(req.query);
    if (req.query.keyword) { 
        const title = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { title: title },
            { slug: textSlug }
        ];
    }
    const topic = await Topic.find(find).skip(objectPagination.skip).limit(objectPagination.limit);

    res.render("admin/page/topic/index", {
        titlePage: "Thể loại",
        topics: topic,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
}

// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/page/topic/create", {
        titlePage: "Thêm bài thể loại"
    });
}

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
    console.log(req.body)
    let avatar = "";
    if (req.body.avatar) {
        avatar = req.body.avatar;
    }
    interface topic {
        title: String,
        avatar?: String,
        description?: String,
        status: String,
    };
    const data: topic = {
        title: req.body.title,
        avatar: avatar,
        description: req.body.description,
        status: "active",
    }
    const dataTopic = new Topic(data);
    await dataTopic.save();
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
}

// [PATCH] /admin/topics/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status.toString();
    const id: string = req.params.id.toString();
    await Topic.updateOne({
        _id: id
    }, {
        $set: {
            status: status
        }
    });

    res.json({
        code: 200,
        message: "Cập nhật thành công",
        status: status
    });
}

// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
    const idTopic: string = req.params.id.toString();
    const topic = await Topic.findOne({
        _id: idTopic
    });
    if (!topic) {
        return res.redirect(req.get("referer") || "/");
    }
    res.render("admin/page/topic/edit", {
        titlePage: "Chỉnh sửa thể loại",
        topic: topic
    });
}

// [PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    console.log(req.body)
    const idTopic: string = req.params.id.toString();
    interface topic {
        title: String,
        avatar?: String,
        description?: String,
        status: String,
    };
    const data: topic = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    }
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    await Topic.updateOne({
        _id: idTopic
    }, data);
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
}

// [DELETE] /admin/topics/delete/:id
export const deleted = async (req: Request, res: Response) => {
    const idTopic: string = req.params.id.toString();
    await Topic.updateOne({
        _id: idTopic
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
}