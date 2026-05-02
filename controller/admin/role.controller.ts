import { Request, Response } from "express";

import Role from "../../model/role.model";

import { systemConfig } from "../../config/system";
import { search } from "../../helper/search";
import { pagination } from "../../helper/pagination";
import { filterStatus } from "../../helper/filterStatus";

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
    const count = await Role.countDocuments(find);
    const objectPagination = pagination(req.query, count);
    // Tìm kiếm
    const objectSearch = search(req.query);
    if (objectSearch.regex) {
        const title = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { title: title },
            { slug: textSlug }
        ];
    }
    // Tìm tất cả nhóm quyền
    const role = await Role.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/role/index", {
        titlePage: "Nhóm quyền",
        role: role,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
}

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/page/role/create", {
        titlePage: "Thêm nhóm quyền"
    });
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    interface role {
        title: string;
        description?: string;
        permissions: string[];
        status: string;
    }

    const data: role = {
        title: req.body.title,
        description: req.body.description,
        permissions: [],
        status: "active",
    }
    const dataRole = new Role(data);
    await dataRole.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    const idRole: string = req.params.id.toString();
    const role = await Role.findOne({
        _id: idRole,
        deleted: false
    });
    res.render("admin/page/role/edit", {
        titlePage: "Chỉnh sửa nhóm quyền",
        role: role
    });
}

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    console.log(req.body)
    const idRole: string = req.params.id.toString();
    interface role {
        title: string;
        description?: string;
        permissions: string[];
        status: string;
    }
    const data: role = {
        title: req.body.title,
        status: req.body.status,
        permissions: []
    }
    if (req.body.description) {
        data["description"] = req.body.description;
    }
    await Role.updateOne({
        _id: idRole
    }, data);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [PATCH] /admin/roles/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    const status: string = req.params.status.toString();
    const id: string = req.params.id.toString();
    await Role.updateOne({
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

// [DELETE] /admin/roles/delete/:id
export const deleted = async (req: Request, res: Response) => {
    const idRole: string = req.params.id.toString();
    await Role.updateOne({
        _id: idRole
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/permission
export const permission = async (req: Request, res: Response) => {
    const role = await Role.find({
        deleted: false,
    });
    res.render("admin/page/role/permission", {
        titlePage: "Phân quyền",
        role: role
    });
}

// [PATCH] /admin/roles/permission
export const permissionPatch = async (req: Request, res: Response) => {
    const data = JSON.parse(req.body.permission);
    if(data){
        await Role.updateOne({
            _id: data.role_id
        }, {
            $set: {
                permission: data.permission
            }
        });
    }
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/dashboard`);
}