import { Request, Response } from "express";

import Topic from "../../model/topics.model";
import Song from "../../model/song.model";
import Singer from "../../model/singer.model";

import { systemConfig } from "../../config/system";
import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";
import { filterStatus } from "../../helper/filterStatus";

// [GET] /admin/singers
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
    const count = await Singer.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    const objectSearch = search(req.query);
    if (objectSearch.regex) {
        const nameSinger = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { nameSinger: nameSinger },
            { slug: textSlug }
        ];
    }
    // Tìm tất cả bài hát
    const singer = await Singer.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    // Số bài hát của ca sĩ
    const idSinger = singer.map(item => item.id);
    const songMap = {};
    for (const id of idSinger) {
        const count = await Song.countDocuments({
            singer_id: id,
            deleted: false
        });
        songMap[id] = count;
    }
    singer.forEach(item => {
        item["totalSong"] = songMap[item.id];
    });
    res.render("admin/page/singer/index", {
        titlePage: "Ca sĩ/Nghệ sĩ",
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword,
        singer: singer,
    });
}

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/page/singer/create", {
        titlePage: "Thêm ca sĩ/nghệ sĩ mới"
    });
}

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    console.log(req.body)
    let avatar = "";
    if (req.body.avatar) {
        avatar = req.body.avatar;
    }
    interface singer {
        nameSinger: string;
        avatar?: string;
        description?: string;
        status: string;
    };
    const data: singer = {
        nameSinger: req.body.nameSinger,
        avatar: avatar,
        description: req.body.description,
        status: "active",
    }
    const dataSinger = new Singer(data);
    await dataSinger.save();
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
}

// [GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    const idSinger: string = req.params.id.toString();
    const singer = await Singer.findOne({
        _id: idSinger
    });
    if (!singer) {
        return res.redirect(req.get("referer") || "/");
    }
    res.render("admin/page/singer/edit", {
        titlePage: "Chỉnh sửa ca sĩ/nghệ sĩ",
        singer: singer
    });
}

// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    console.log(req.body)
    const idSinger: string = req.params.id.toString();
    interface singer {
        nameSinger: string;
        avatar?: string;
        description?: string;
        status: string;
    };
    const data: singer = {
        nameSinger: req.body.nameSinger,
        description: req.body.description,
        status: "active",
    }
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    await Singer.updateOne({
        _id: idSinger
    }, data);
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
}

// [PATCH] /admin/singers/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status.toString();
    const id: string = req.params.id.toString();
    await Singer.updateOne({
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

// [DELETE] /admin/singers/delete/:id
export const deleted = async (req: Request, res: Response) => {
    const idSinger: string = req.params.id.toString();
    await Singer.updateOne({
        _id: idSinger
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
}