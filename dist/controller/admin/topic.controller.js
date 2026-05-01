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
exports.deleted = exports.editPatch = exports.edit = exports.changeStatus = exports.createPost = exports.create = exports.index = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const search_1 = require("../../helper/search");
const pagination_1 = require("../../helper/pagination");
const filterStatus_1 = require("../../helper/filterStatus");
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false
    };
    const filter = (0, filterStatus_1.filterStatus)(req.query);
    if (req.query.status) {
        find["status"] = req.query.status;
    }
    const count = yield topics_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    if (req.query.keyword) {
        const objectSearch = (0, search_1.search)(req.query);
        const title = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { title: title },
            { slug: textSlug }
        ];
    }
    const topic = yield topics_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    res.render("admin/page/topic/index", {
        titlePage: "Thể loại",
        topics: topic,
        pagination: objectPagination,
        filterStatus: filter,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/page/topic/create", {
        titlePage: "Thêm bài thể loại"
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let avatar = "";
    if (req.body.avatar) {
        avatar = req.body.avatar;
    }
    ;
    const data = {
        title: req.body.title,
        avatar: avatar,
        description: req.body.description,
        status: "active",
    };
    const dataTopic = new topics_model_1.default(data);
    yield dataTopic.save();
    res.redirect(`${system_1.systemConfig.prefixAdmin}/topics`);
});
exports.createPost = createPost;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield topics_model_1.default.updateOne({
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
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.id.toString();
    const topic = yield topics_model_1.default.findOne({
        _id: idTopic
    });
    if (!topic) {
        return res.redirect(req.get("referer") || "/");
    }
    res.render("admin/page/topic/edit", {
        titlePage: "Chỉnh sửa thể loại",
        topic: topic
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const idTopic = req.params.id.toString();
    ;
    const data = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    };
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    yield topics_model_1.default.updateOne({
        _id: idTopic
    }, data);
    res.redirect(`${system_1.systemConfig.prefixAdmin}/topics`);
});
exports.editPatch = editPatch;
const deleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idTopic = req.params.id.toString();
    yield topics_model_1.default.updateOne({
        _id: idTopic
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/topics`);
});
exports.deleted = deleted;
