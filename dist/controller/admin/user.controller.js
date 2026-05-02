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
exports.deleted = exports.changeStatus = exports.index = void 0;
const user_model_1 = __importDefault(require("../../model/user.model"));
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
    const count = yield user_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        const userName = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { userName: userName },
            { slug: textSlug }
        ];
    }
    const user = yield user_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/user/index", {
        titlePage: "Người dùng",
        user: user,
        pagination: objectPagination,
        filterStatus: filter,
        keyword: objectSearch.keyword
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield user_model_1.default.updateOne({
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
    const idUser = req.params.id.toString();
    yield user_model_1.default.updateOne({
        _id: idUser
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/users`);
});
exports.deleted = deleted;
