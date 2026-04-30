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
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topics_model_1 = __importDefault(require("../../model/topics.model"));
const song_model_1 = __importDefault(require("../../model/song.model"));
const singer_model_1 = __importDefault(require("../../model/singer.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const song = yield song_model_1.default.find({
        deleted: false,
    });
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
    res.render("admin/page/song/index", {
        titlePage: "Thể loại",
        songs: song
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
