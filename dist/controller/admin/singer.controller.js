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
exports.deleted = exports.changeStatus = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../model/song.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
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
    const count = yield singer_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    const objectSearch = (0, search_1.search)(req.query);
    if (objectSearch.regex) {
        const nameSinger = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { nameSinger: nameSinger },
            { slug: textSlug }
        ];
    }
    const singer = yield singer_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    const idSinger = singer.map(item => item.id);
    const songMap = {};
    for (const id of idSinger) {
        const count = yield song_model_1.default.countDocuments({
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
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/page/singer/create", {
        titlePage: "Thêm ca sĩ/nghệ sĩ mới"
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
        nameSinger: req.body.nameSinger,
        avatar: avatar,
        description: req.body.description,
        status: "active",
    };
    const dataSinger = new singer_model_1.default(data);
    yield dataSinger.save();
    res.redirect(`${system_1.systemConfig.prefixAdmin}/singers`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSinger = req.params.id.toString();
    const singer = yield singer_model_1.default.findOne({
        _id: idSinger
    });
    if (!singer) {
        return res.redirect(req.get("referer") || "/");
    }
    res.render("admin/page/singer/edit", {
        titlePage: "Chỉnh sửa ca sĩ/nghệ sĩ",
        singer: singer
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const idSinger = req.params.id.toString();
    ;
    const data = {
        nameSinger: req.body.nameSinger,
        description: req.body.description,
        status: "active",
    };
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar;
    }
    yield singer_model_1.default.updateOne({
        _id: idSinger
    }, data);
    res.redirect(`${system_1.systemConfig.prefixAdmin}/singers`);
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield singer_model_1.default.updateOne({
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
    const idSinger = req.params.id.toString();
    yield singer_model_1.default.updateOne({
        _id: idSinger
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/singers`);
});
exports.deleted = deleted;
