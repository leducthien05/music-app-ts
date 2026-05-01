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
const topics_model_1 = __importDefault(require("../../model/topics.model"));
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
    if (req.query.topic) {
        const slug = req.query.topic.toString();
        const topic = yield topics_model_1.default.findOne({
            deleted: false,
            slug: slug
        });
        if (topic) {
            find["topic_id"] = topic.id;
        }
    }
    if (req.query.singer) {
        const slug = req.query.singer.toString();
        const singer = yield singer_model_1.default.findOne({
            deleted: false,
            slug: slug
        });
        if (singer) {
            find["singer_id"] = singer.id;
        }
    }
    const count = yield song_model_1.default.countDocuments(find);
    const objectPagination = (0, pagination_1.pagination)(req.query, count);
    if (req.query.keyword) {
        const objectSearch = (0, search_1.search)(req.query);
        const nameSong = objectSearch.regex;
        const textSlug = objectSearch.slug;
        find["$or"] = [
            { nameSong: nameSong },
            { slug: textSlug }
        ];
    }
    const song = yield song_model_1.default.find(find).skip(objectPagination.skip).limit(objectPagination.limit);
    const idSinger = song.map(item => {
        if (item.singer_id != "") {
            return item.singer_id;
        }
    });
    const idSingerUnique = [...new Set(idSinger)];
    const singer = yield singer_model_1.default.find({
        deleted: false,
        _id: { $in: idSingerUnique }
    });
    const singerMap = {};
    singer.forEach(item => {
        singerMap[item._id.toString()] = item.nameSinger;
    });
    song.forEach(item => {
        item["nameSinger"] = singerMap[item.singer_id.toString()];
    });
    const singerAll = yield singer_model_1.default.find({
        deleted: false,
    }).select("nameSinger slug");
    const topicAll = yield topics_model_1.default.find({
        deleted: false
    });
    res.render("admin/page/song/index", {
        titlePage: "Thể loại",
        songs: song,
        pagination: objectPagination,
        filterStatus: filter,
        singer: singerAll,
        topic: topicAll
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singer = yield singer_model_1.default.find({
        deleted: false,
    });
    const topic = yield topics_model_1.default.find({
        deleted: false
    });
    res.render("admin/page/song/create", {
        titlePage: "Thêm bài hát mới",
        singer: singer,
        topic: topic
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let avatar = "";
    let audio = "";
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    ;
    const data = {
        nameSong: req.body.nameSong,
        singer_id: req.body.singer_id,
        avatar: avatar,
        audio: audio,
        description: req.body.description,
        topic_id: req.body.topic_id,
        releaseDate: req.body.releaseDate,
        status: "active",
    };
    const dataSong = new song_model_1.default(data);
    yield dataSong.save();
    res.redirect(`${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.id.toString();
    const song = yield song_model_1.default.findOne({
        _id: idSong
    });
    if (!song) {
        return res.redirect(req.get("referer") || "/");
    }
    const singer = yield singer_model_1.default.find({
        deleted: false,
    });
    const topic = yield topics_model_1.default.find({
        deleted: false
    });
    res.render("admin/page/song/edit", {
        titlePage: "Chỉnh sửa bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const idSong = req.params.id.toString();
    ;
    const data = {
        nameSong: req.body.nameSong,
        singer_id: req.body.singer_id,
        description: req.body.description,
        topic_id: req.body.topic_id,
        releaseDate: req.body.releaseDate,
        status: "active",
        lyrics: req.body.lyrics
    };
    if (req.body.audio) {
        data["audio"] = req.body.audio[0];
    }
    if (req.body.avatar) {
        data["avatar"] = req.body.avatar[0];
    }
    yield song_model_1.default.updateOne({
        _id: idSong
    }, data);
    res.redirect(`${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.editPatch = editPatch;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status.toString();
    const id = req.params.id.toString();
    yield song_model_1.default.updateOne({
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
    const idSong = req.params.id.toString();
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        $set: {
            deleted: true
        }
    });
    res.redirect(`${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.deleted = deleted;
