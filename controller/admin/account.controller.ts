import { Request, Response } from "express";

import Account from "../../model/account.model";
import Role from "../../model/role.model";

import { systemConfig } from "../../config/system";
import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";
import { filterStatus } from "../../helper/filterStatus";
import * as passwordHelper from "../../helper/password";

// [GET] /admin/accounts
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
    const count = await Account.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    const objectSearch = search(req.query);
    if (objectSearch.regex) {
        const fullName = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { fullname: fullName },
            { slug: textSlug }
        ];
    }
    // Tìm tất cả bài hát
    const account = await Account.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/account/index", {
        titlePage: "Tài khoản",
        account: account,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
}

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
    const role = await Role.find({
        deleted: false
    });
    res.render("admin/page/account/create", {
        titlePage: "Thêm tài khoản",
        role: role
    });
}

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
    const email: string = req.body.email.toString();
    const existEmail = await Account.findOne({
        deleted: false,
        email: email
    });
    if (existEmail) {
        return res.redirect(req.get("referer") || "/admin/accounts");
    }
    else {
        let avatar = "";
        if (req.body.avatar) {
            avatar = req.body.avatar;
        }

        interface account {
            fullName: String,
            phone?: String,
            email: String,
            password: String,
            role_id?: String,
            avatar?: String,
            status: String
        };
        const password = await passwordHelper.hashPassword(req.body.password);
        const data: account = {
            fullName: req.body.fullName,
            avatar: avatar,
            email: email,
            password: password,
            role_id: req.body.role_id,
            status: "active",
        }
        const dataAccount = new Account(data);
        await dataAccount.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

}

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    const idAccount: string = req.params.id.toString();
    const account = await Account.findOne({
        _id: idAccount,
        deleted: false
    });
    if(!account){
        return res.redirect(req.get("referer"));
    }
    const role = await Role.find({
        deleted: false
    });
    res.render("admin/page/account/edit", {
        titlePage: "Chỉnh sửa tài khoản",
        account: account,
        role: role
    });
}

// [PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const idAccount: string = req.params.id.toString();
    console.log(req.body)
    const existEmail = await Account.findOne({
        _id: {$ne: idAccount},
        email: req.body.email,
        status: "active",
        deleted: false
    });
    if(existEmail){
        return res.redirect(req.get("referer"));
    }
    interface account {
        fullName: String,
        phone?: String,
        email: String,
        password?: String,
        role_id?: String,
        avatar?: String,
        status: String
    };
    const data: account = {
        fullName: req.body.fullName,
        email: req.body.email,
        status: "active",
    }
    let password;
    if (req.body.password) {
        password = await passwordHelper.hashPassword(req.body.password);
        data["password"] = password;
    }
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    if(req.body.role_id){
        data["role_id"] = req.body.role_id
    }
    await Account.updateOne({
        _id: idAccount
    }, data);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status.toString();
    const id: string = req.params.id.toString();
    await Account.updateOne({
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

// [DELETE] /admin/accounts/delete/:id
export const deleted = async (req: Request, res: Response) => {
    const idAccount: string = req.params.id.toString();
    await Account.updateOne({
        _id: idAccount
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}