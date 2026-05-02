import { Request, Response } from "express";

import User from "../../model/user.model";

import { systemConfig } from "../../config/system";
import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";
import { filterStatus } from "../../helper/filterStatus";

// [GET] /admin/users
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
    const count = await User.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    const objectSearch = search(req.query);
    if (objectSearch.regex) {
        const userName = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { userName: userName },
            { slug: textSlug }
        ];
    }
    // Tìm tất cả bài hát
    const user = await User.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    
    res.render("admin/page/user/index", {
        titlePage: "Người dùng",
        user: user,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
}

// [PATCH] /admin/users/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status.toString();
    const id: string = req.params.id.toString();
    await User.updateOne({
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

// [DELETE] /admin/users/delete/:id
export const deleted = async (req: Request, res: Response) => {
    const idUser: string = req.params.id.toString();
    await User.updateOne({
        _id: idUser
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${systemConfig.prefixAdmin}/users`);
}