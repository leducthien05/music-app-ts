"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionPatch = exports.permission = exports.deleted = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../model/role.model"));
const system_1 = require("../../config/system");
const search_1 = require("../../helper/search");
const pagination_1 = require("../../helper/pagination");
const filterStatus_1 = require("../../helper/filterStatus");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    const filter = (0, filterStatus_1.filterStatus)(req.query);
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    const count = yield role_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        const title = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { title: title },
            { slug: textSlug }
        ];
    }
    const role = yield role_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/role/index", {
        titlePage: "Nhóm quyền",
        role: role,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/page/role/create", {
        titlePage: "Thêm nhóm quyền"
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        title: req.body.title,
        description: req.body.description,
        permissions: [],
        status: "active",
    };
    const dataRole = new role_model_1.default(data);
    yield dataRole.save();
    res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idRole = req.params.id.toString();
    const role = yield role_model_1.default.findOne({
        _id: idRole,
        deleted: false
    });
    res.render("admin/page/role/edit", {
        titlePage: "Chỉnh sửa nhóm quyền",
        role: role
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const idRole = req.params.id.toString();
    const data = {
        title: req.body.title,
        status: req.body.status,
        permissions: []
    };
    if (req.body.description) {
        data["description"] = req.body.description;
    }
    yield role_model_1.default.updateOne({
        _id: idRole
    }, data);
    res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield role_model_1.default.updateOne({
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
});
exports.changeStatus = changeStatus;
const deleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idRole = req.params.id.toString();
    yield role_model_1.default.updateOne({
        _id: idRole
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/roles`);
});
exports.deleted = deleted;
const permission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.find({
        deleted: false,
    });
    res.render("admin/page/role/permission", {
        titlePage: "Phân quyền",
        role: role
    });
});
exports.permission = permission;
const permissionPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.parse(req.body.permission);
    if (data) {
        yield role_model_1.default.updateOne({
            _id: data.role_id
        }, {
            $set: {
                permission: data.permission
            }
        });
    }
    res.redirect(req.get("referer") || `${system_1.systemConfig.prefixAdmin}/dashboard`);
});
exports.permissionPatch = permissionPatch;
